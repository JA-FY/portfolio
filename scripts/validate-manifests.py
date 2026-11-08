"""Check the rendered portfolio manifests without connecting to the cluster."""

import re
import subprocess
from pathlib import Path

import yaml


def validate(environment, namespace, replicas):
    overlay = Path(__file__).resolve().parents[1] / "k8s/overlays" / environment
    rendered = subprocess.check_output(["kubectl", "kustomize", overlay], text=True)
    resources = {(obj["kind"], obj["metadata"]["name"]): obj for obj in yaml.safe_load_all(rendered)}
    deployment = resources["Deployment", "portfolio"]
    service = resources["Service", "portfolio-service"]
    spec = deployment["spec"]
    pod = spec["template"]
    containers = {c["name"]: c for c in pod["spec"]["containers"]}
    app = containers["portfolio"]
    labels = pod["metadata"]["labels"]
    selectors = [service["spec"]["selector"], spec["selector"]["matchLabels"]]
    checks = {
        "namespace": all(obj["metadata"]["namespace"] == namespace for obj in (deployment, service)),
        "replica count": spec["replicas"] == replicas,
        "service and deployment selectors": all(s and s.items() <= labels.items() for s in selectors),
        "portfolio image tag": re.fullmatch(rf"jafy10/portfolio:{environment}-[0-9a-f]{{7,40}}", app["image"]),
        "app port": any(p["containerPort"] == 3000 for p in app["ports"]),
        "service port": any(p["port"] == 80 and p["targetPort"] == 3000 for p in service["spec"]["ports"]),
        "tunnel container": "cloudflared" in containers,
    }
    if environment == "prod":
        checks["production host spread"] = any(
            rule["topologyKey"] == "kubernetes.io/hostname" and rule["maxSkew"] == 1
            and rule["whenUnsatisfiable"] == "ScheduleAnyway"
            and rule["labelSelector"].get("matchLabels") == spec["selector"]["matchLabels"]
            for rule in pod["spec"].get("topologySpreadConstraints", [])
        )
    failed = [name for name, passed in checks.items() if not passed]
    if failed:
        raise SystemExit(f"{environment} failed: {', '.join(failed)}")
    print(f"{environment}: {len(checks)} deployment checks passed")


if __name__ == "__main__":
    validate("dev", "portfolio-dev", 1)
    validate("prod", "portfolio", 2)
