import { Project } from './data';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative flex flex-col p-6 rounded-xl border border-white/10 backdrop-blur-md hover:bg-black/40 hover:border-white/20 transition-all duration-300">
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>
        <span className="text-xs font-mono text-cyan-500/80 border border-cyan-500/20 px-2 py-1 rounded bg-cyan-500/10">
          {project.status}
        </span>
      </div>

      <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {project.tech.map((t) => (
          <span 
            key={t} 
            className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 group-hover:text-neutral-300 transition-colors"
          >
            {t}
          </span>
        ))}
      </div>
      
    </div>
  );
}
