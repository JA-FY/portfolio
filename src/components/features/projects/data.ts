export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  status: 'Live' | 'Archived' | 'In Progress';
  link?: string;
}

export const projects: Project[] = [
  {
    id: 'k8s-cluster',
    title: 'Home Lab Cluster',
    description: 'Multi-node Kubernetes cluster running on bare metal. Automated CI/CD pipelines with ArgoCD and monitoring via Prometheus/Grafana.',
    tech: ['Kubernetes', 'Ubuntu-Server', 'Go'],
    status: 'Live',
  },
  {
    id: 'microservices-thesis',
    title: 'Ura',
    description: 'Real State Developer website. A fast, animated and carefully designed website that aims to capture every eyeball that dares to watch',
    tech: ['NextJS', 'React-three', 'Go', 'ArgoCD'],
    status: 'In Progress',
  },

];
