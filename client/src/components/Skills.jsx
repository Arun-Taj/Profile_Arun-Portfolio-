import React, { useState } from 'react'
import "devicon/devicon.min.css";

const CATEGORY_META = {
  frontend:  { label: 'Frontend',  color: '#00f5ff', glow: 'rgba(0,245,255,0.15)'  },
  backend:   { label: 'Backend',   color: '#7c3aed', glow: 'rgba(124,58,237,0.15)' },
  database:  { label: 'Database',  color: '#f72585', glow: 'rgba(247,37,133,0.15)' },
  devops:    { label: 'DevOps',    color: '#39ff14', glow: 'rgba(57,255,20,0.12)'  },
  tools:     { label: 'Tools',     color: '#fbbf24', glow: 'rgba(251,191,36,0.15)' },
  languages: { label: 'Languages', color: '#f97316', glow: 'rgba(249,115,22,0.15)' },
  other:     { label: 'Other',     color: '#94a3b8', glow: 'rgba(148,163,184,0.12)'},
}

// Maps skill name (lowercased) → devicon class + brand color
const SKILL_ICONS = {
   'react.js':           { icon: 'devicon-react-original colored'           },
  'react':              { icon: 'devicon-react-original colored'           },
  'javascript (es6+)':  { icon: 'devicon-javascript-plain colored'        },
  'javascript':         { icon: 'devicon-javascript-plain colored'        },
  'typescript':         { icon: 'devicon-typescript-plain colored'        },
  'css / tailwind':     { icon: 'devicon-tailwindcss-plain colored'       },
  'tailwind css':       { icon: 'devicon-tailwindcss-plain colored'       },
  'html':               { icon: 'devicon-html5-plain colored'             },
  'html5':              { icon: 'devicon-html5-plain colored'             },
  'css':                { icon: 'devicon-css3-plain colored'              },
  'next.js':            { icon: 'devicon-nextjs-plain'                    },
  'node.js':            { icon: 'devicon-nodejs-plain colored'            },
  'nodejs':             { icon: 'devicon-nodejs-plain colored'            },
  'express.js':         { icon: 'devicon-express-original'                },
  'express':            { icon: 'devicon-express-original'                },
  'rest api design':    { icon: 'devicon-fastapi-plain colored'           },
  'fastapi':            { icon: 'devicon-fastapi-plain colored'           },
  'python':             { icon: 'devicon-python-plain colored '            },
  'c++':                { icon: 'devicon-cplusplus-plain colored'         },
  'mongodb':            { icon: 'devicon-mongodb-plain colored'           },
  'postgresql':         { icon: 'devicon-postgresql-plain colored'        },
  'mysql':              { icon: 'devicon-mysql-plain colored'             },
  'firebase':           { icon: 'devicon-firebase-plain colored'          },
  'sqlite':             { icon: 'devicon-sqlite-plain colored'            },
  'docker':             { icon: 'devicon-docker-plain colored'            },
  'aws':                { icon: 'devicon-amazonwebservices-plain colored'  },
  'git':                { icon: 'devicon-git-plain colored'               },
  'git / github':       { icon: 'devicon-github-original'                 },
  'github':             { icon: 'devicon-github-original'                 },
  'linux':              { icon: 'devicon-linux-plain colored'             },
  'vscode':             { icon: 'devicon-vscode-plain colored'            },
  'postman':            { icon: 'devicon-postman-plain colored'           },
  'postman / insomnia': { icon: 'devicon-postman-plain colored'           },
  'webpack':            { icon: 'devicon-webpack-plain colored'           },
  'vite':               { icon: 'devicon-vitejs-plain colored'            },
  'bootstrap':          { icon: 'devicon-bootstrap-plain colored'         },
  'sass':               { icon: 'devicon-sass-plain colored'              },
  'flutter': {icon:'devicon-flutter-plain'}
}

// Fallback: generate initials from skill name
function getInitials(name) {
  return name.split(/[\s./+#-]/).map(w => w[0]).filter(Boolean).join('').slice(0, 2).toUpperCase()
}

function SkillChip({ skill, catColor, catGlow }) {
  const iconData = SKILL_ICONS[skill.name.toLowerCase()]

  return (
    <div
      className="card-base group flex flex-col items-center gap-2.5 p-4 cursor-default transition-all duration-300 hover:scale-[1.03]"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = catColor;
        e.currentTarget.style.boxShadow = `0 0 15px ${catGlow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Icon Wrapper */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all duration-300 group-hover:scale-110"
        style={{
          background: `${catColor}12`,
          border: `1px solid ${catColor}25`,
        }}
      >
        {iconData ? (
          <i className={iconData.icon} style={{ fontSize: 24 }} />
        ) : (
          <span
            className="font-display font-bold text-sm"
            style={{ color: catColor }}
          >
            {getInitials(skill.name)}
          </span>
        )}
      </div>

      {/* Skill name */}
      <span className="text-[0.72rem] text-text-secondary font-mono text-center leading-tight group-hover:text-text-primary transition-colors duration-200 tracking-wide">
        {skill.name}
      </span>
    </div>
  )
}

export default function Skills({ skills }) {
  const data = skills?.length > 0 ? skills : DEFAULT_SKILLS;

  const categories = Object.keys(CATEGORY_META).filter((cat) =>
    data.some((s) => s.category === cat)
  );

  const [activeCategory, setActiveCategory] = useState(null);

  const selectedSkills = activeCategory
    ? data.filter((skill) => skill.category === activeCategory)
    : [];

  return (
    <section 
      id="skills" 
      className="section-base relative overflow-hidden"
          >
      
      <div className="container-base relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-subtitle">What I work with</p>
          <h2 className="section-title">Technical Skills</h2>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat];
            const count = data.filter((skill) => skill.category === cat).length;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className="group px-6 py-4 rounded-xl border transition-all duration-300 cursor-pointer min-w-[180px] hover:scale-[1.02]"
                style={
                  isActive
                    ? {
                        background: meta.color,
                        color: "#000",
                        borderColor: "transparent",
                        boxShadow: `0 0 24px ${meta.glow}`,
                      }
                    : {
                        background: "rgba(255,255,255,0.02)",
                        borderColor: "rgba(255,255,255,0.06)",
                        color: "#94a3b8",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = meta.color;
                    e.currentTarget.style.boxShadow = `0 0 15px ${meta.glow}`;
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
              >
                <div className="relative z-10 transition-all duration-300 group-hover:-translate-y-0.5">
                  <div className="font-display font-semibold text-sm uppercase tracking-wider">
                    {meta.label}
                  </div>
                  <div className="mt-2 text-xs opacity-70">
                    {count} Skills
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Category Skills Grid */}
        {activeCategory && (
          <div className="animate-fadeIn">
            {(() => {
              const meta = CATEGORY_META[activeCategory];

              return (
                <>
                  {/* Category Header Separator */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: meta.color,
                          boxShadow: `0 0 8px ${meta.color}`,
                        }}
                      />
                      <h3
                        className="font-display font-bold text-xl tracking-[0.15em] uppercase"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </h3>
                      <span className="font-mono text-[0.62rem] text-text-muted border border-white/10 px-2 py-0.5 rounded-full">
                        {selectedSkills.length}
                      </span>
                    </div>
                    <div
                      className="flex-1 h-px"
                      style={{
                        background: `linear-gradient(to right, ${meta.color}35, transparent)`,
                      }}
                    />
                  </div>

                  {/* Dynamic Skills Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {selectedSkills.map((skill) => (
                      <SkillChip
                        key={skill._id || skill.name}
                        skill={skill}
                        catColor={meta.color}
                        catGlow={meta.glow}
                      />
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-10 border-t border-white/[0.06] text-center">
          <p className="font-mono text-[0.65rem] text-text-muted tracking-[0.25em] uppercase mb-2">
            🔍💻Always Learning
          </p>
          <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
            Continuously exploring new tools and technologies to stay at the
            cutting edge of modern software development.
          </p>
        </div>
      </div>
    </section>
  );
}