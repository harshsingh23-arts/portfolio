import { useState, useRef, useEffect, KeyboardEvent, MouseEvent } from 'react';
import { useChat } from './hooks/useChat';

interface Project {
  title: string;
  year: string;
  description: string;
  tech: string[];
  stats?: string;
}

interface Experience {
  company: string;
  role: string;
  period: string;
  bullets: string[];
  tech: string[];
}

const PROJECTS: Project[] = [
  {
    title: 'Surface Defect Detection',
    year: '2024',
    description: 'ML application to automatically detect and classify surface defects on manufacturing materials using image processing algorithms.',
    tech: ['Python', 'Machine Learning', 'Image Processing'],
    stats: 'Automates QC',
  },
  {
    title: 'Prescription Checker App',
    year: '2024',
    description: 'Android mobile app to help users verify and organize medical prescriptions with a user-friendly interface for all age groups.',
    tech: ['Kotlin', 'Android', 'XML'],
    stats: 'Health Tech',
  },
  {
    title: 'Real-Time Chat App',
    year: '2023',
    description: 'Fully functional chat application with real-time messaging, concurrent user sessions, and optimized low-latency communication.',
    tech: ['Web Technologies', 'Backend', 'WebSockets'],
    stats: 'Real-Time',
  },
];

const EXPERIENCE: Experience[] = [
  {
    company: 'VIT Vellore',
    role: 'B.Tech Information Technology',
    period: '2023 - 2027',
    bullets: [
      'Currently in 3rd year with strong foundation in DSA and OOP',
      'Hands-on experience in Full Stack, Mobile App, and ML development',
      'Actively seeking internship opportunities in software development',
    ],
    tech: ['Java', 'Python', 'Kotlin', 'C++', 'DSA'],
  },
];

const SKILLS: string[] = [
  'Java', 'Python', 'Kotlin', 'C', 'C++',
  'DSA', 'OOP', 'Android Dev', 'Web Dev', 'Machine Learning',
  'Android Studio', 'Git', 'VS Code', 'Full Stack', 'Mobile Apps',
];

const SUGGESTED_QUESTIONS: string[] = [
  "What's your tech stack?",
  'Tell me about your projects',
  'Are you open to internships?',
  'What are your strongest skills?',
];

interface ChatMessageProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';
  return (
    <div style={{
      display: 'flex', gap: '12px', alignItems: 'flex-start',
      animation: 'fadeUp 0.3s ease forwards',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
    }}>
      {!isUser && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: 'var(--accent)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0, fontSize: '11px',
          fontFamily: 'var(--mono)', color: 'var(--white)', fontWeight: 700,
        }}>HS</div>
      )}
      <div style={{
        maxWidth: '75%',
        background: isUser ? 'var(--accent)' : 'var(--card-bg)',
        border: '1px solid ' + (isUser ? 'var(--accent)' : 'var(--border)'),
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        padding: '12px 16px', fontSize: '14px', lineHeight: '1.6',
        color: 'var(--white)', whiteSpace: 'pre-wrap',
      }}>{content}</div>
      {isUser && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: '#2a2a24', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0, fontSize: '12px',
          color: 'var(--muted)',
        }}>U</div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: 'var(--accent)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '11px', fontFamily: 'var(--mono)',
        color: 'var(--white)', fontWeight: 700,
      }}>HS</div>
      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--border)',
        borderRadius: '16px 16px 16px 4px', padding: '14px 18px',
        display: 'flex', gap: '6px', alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--accent)',
            animation: 'pulse 1.2s ease ' + (i * 0.2) + 's infinite',
          }} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('home');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage, clearChat } = useChat(apiKey);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function handleSend() {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const navItems = ['Home', 'Projects', 'Skills', 'Contact'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,8,0.9)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '60px',
      }}>
        <span style={{ fontFamily: 'var(--display)', fontSize: '22px', letterSpacing: '0.05em', color: 'var(--accent)' }}>
          HS
        </span>
        <div style={{ display: 'flex', gap: '32px' }}>
          {navItems.map(item => {
            const isActive = activeSection === item.toLowerCase();
            return (
              <a key={item} href={'#' + item.toLowerCase()}
                onClick={() => setActiveSection(item.toLowerCase())}
                style={{
                  fontFamily: 'var(--mono)', fontSize: '12px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: isActive ? 'var(--accent)' : 'var(--muted)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--white)';
                }}
                onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.color = isActive ? 'var(--accent)' : 'var(--muted)';
                }}
              >{item}</a>
            );
          })}
        </div>
        <button onClick={() => setChatOpen(true)}
          onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = '1'; }}
          style={{
            background: 'var(--accent)', color: 'var(--white)',
            padding: '8px 18px', borderRadius: '4px',
            fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.08em',
            border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
          }}>Ask AI</button>
      </nav>

      {/* HERO */}
      <section id="home" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '80px 40px 40px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--white) 1px, transparent 1px), linear-gradient(90deg, var(--white) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div style={{
          position: 'absolute', right: '-100px', top: '20%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,80,10,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

            <div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.15em',
                textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--accent)', animation: 'pulse 2s ease infinite',
                  display: 'inline-block',
                }} />
                Open to internships
              </div>

              <h1 style={{
                fontFamily: 'var(--display)',
                fontSize: 'clamp(60px, 8vw, 100px)',
                lineHeight: '0.9', letterSpacing: '0.02em', marginBottom: '24px',
              }}>
                HARSH<br />
                <span style={{ color: 'var(--accent)' }}>SINGH</span>
              </h1>

              <p style={{
                fontFamily: 'var(--body)', fontSize: '18px', color: 'var(--muted)',
                lineHeight: '1.6', marginBottom: '12px', maxWidth: '420px',
              }}>
                B.Tech IT Student at VIT Vellore. Building things with Java, Python, Kotlin and Machine Learning.
              </p>

              <p style={{
                fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent)',
                marginBottom: '40px',
              }}>
                3rd Year &bull; 2023-2027 &bull; Vellore, Tamil Nadu
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button onClick={() => setChatOpen(true)}
                  onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = '1'; }}
                  style={{
                    background: 'var(--accent)', color: 'var(--white)',
                    padding: '14px 28px', borderRadius: '4px',
                    fontFamily: 'var(--mono)', fontSize: '13px', letterSpacing: '0.08em',
                    border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>Chat with my AI</button>

                <a href="#projects" style={{
                  background: 'transparent', color: 'var(--white)',
                  padding: '14px 28px', borderRadius: '4px',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--mono)', fontSize: '13px', letterSpacing: '0.08em',
                  display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                }}
                  onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--white)';
                  }}>View Projects</a>
              </div>
            </div>

            {/* Stats card */}
            <div style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '40px',
            }}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)',
                letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '28px',
              }}>// student_snapshot.json</div>

              {[
                { label: 'Degree', value: 'B.Tech IT' },
                { label: 'University', value: 'VIT' },
                { label: 'Year', value: '3rd' },
                { label: 'Projects built', value: '3+' },
                { label: 'Languages', value: '5+' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '12px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--body)', fontSize: '14px', color: 'var(--muted)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--accent)', letterSpacing: '0.02em' }}>{value}</span>
                </div>
              ))}

              <div style={{ marginTop: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['Java', 'Python', 'Kotlin', 'ML'].map(t => (
                  <span key={t} style={{
                    background: '#1a1a16', border: '1px solid var(--border)',
                    padding: '6px 12px', borderRadius: '100px',
                    fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)',
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: '16px 0', overflow: 'hidden', background: 'var(--card-bg)',
      }}>
        <div style={{ display: 'flex', animation: 'marquee 20s linear infinite', whiteSpace: 'nowrap' }}>
          {[...SKILLS, ...SKILLS].map((skill, i) => (
            <span key={skill + i} style={{
              fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--muted)', padding: '0 32px',
            }}>
              {i % 3 === 0 ? <span style={{ color: 'var(--accent)' }}>*</span> : '|'} {skill}
            </span>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px', marginBottom: '60px' }}>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(48px, 6vw, 80px)', letterSpacing: '0.02em' }}>PROJECTS</h2>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>// what i built</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {PROJECTS.map(p => (
              <div key={p.title} style={{
                background: 'var(--card-bg)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '32px', position: 'relative',
                transition: 'all 0.3s', cursor: 'default',
              }}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {p.stats && (
                  <div style={{
                    position: 'absolute', top: '20px', right: '20px',
                    fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)',
                    background: 'rgba(232,80,10,0.1)', padding: '4px 10px', borderRadius: '100px',
                  }}>{p.stats}</div>
                )}
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '12px' }}>{p.year}</div>
                <h3 style={{ fontFamily: 'var(--display)', fontSize: '26px', letterSpacing: '0.02em', marginBottom: '12px' }}>{p.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '24px' }}>{p.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {p.tech.map(t => (
                    <span key={t} style={{
                      border: '1px solid var(--border)', padding: '3px 10px', borderRadius: '4px',
                      fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Education card */}
          <div style={{ marginTop: '20px' }}>
            {EXPERIENCE.map(exp => (
              <div key={exp.company} style={{
                background: 'var(--card-bg)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '40px', transition: 'border-color 0.2s',
              }}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '24px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                      <h3 style={{ fontFamily: 'var(--display)', fontSize: '32px', letterSpacing: '0.02em' }}>{exp.company}</h3>
                      <span style={{
                        background: 'var(--accent)', color: 'var(--white)',
                        padding: '2px 10px', borderRadius: '100px',
                        fontSize: '11px', fontFamily: 'var(--mono)',
                      }}>Current</span>
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>{exp.role}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)', textAlign: 'right' }}>{exp.period}</div>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {exp.bullets.map(b => (
                    <li key={b} style={{ display: 'flex', gap: '12px', fontSize: '15px', color: '#c8c2b4' }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>-&gt;</span> {b}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {exp.tech.map(t => (
                    <span key={t} style={{
                      background: '#1a1a16', border: '1px solid var(--border)',
                      padding: '4px 10px', borderRadius: '4px',
                      fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{
        padding: '100px 40px', background: 'var(--card-bg)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px', marginBottom: '60px' }}>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(48px, 6vw, 80px)', letterSpacing: '0.02em' }}>SKILLS</h2>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>// toolbox</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {SKILLS.map(skill => (
              <div key={skill} style={{
                background: 'var(--black)', border: '1px solid var(--border)',
                borderRadius: '6px', padding: '16px 20px',
                fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)',
                transition: 'all 0.2s', cursor: 'default',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--white)';
                }}
                onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--muted)';
                }}
              >
                <span style={{ color: 'var(--accent)' }}>&gt;</span> {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(48px, 8vw, 100px)',
            letterSpacing: '0.02em', marginBottom: '24px',
          }}>
            HIRE<br /><span style={{ color: 'var(--accent)' }}>ME.</span>
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--muted)', marginBottom: '48px', lineHeight: '1.6' }}>
            Looking for internship opportunities in software development, mobile apps, or machine learning. Let&apos;s build something great.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            {[
              { label: 'Email', href: 'mailto:h55152810@gmail.com', icon: '@' },
              { label: 'Phone', href: 'tel:+917903777659', icon: '#' },
            ].map(link => (
              <a key={link.label} href={link.href} style={{
                background: 'var(--card-bg)', border: '1px solid var(--border)',
                padding: '14px 28px', borderRadius: '4px', color: 'var(--white)',
                fontFamily: 'var(--mono)', fontSize: '13px', letterSpacing: '0.08em',
                display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s',
              }}
                onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--white)';
                }}
              ><span>{link.icon}</span> {link.label}</a>
            ))}
          </div>

          <button onClick={() => setChatOpen(true)}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = '1'; }}
            style={{
              background: 'var(--accent)', color: 'var(--white)',
              padding: '16px 40px', borderRadius: '4px',
              fontFamily: 'var(--mono)', fontSize: '14px', letterSpacing: '0.08em',
              border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
            }}>Or ask my AI anything</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '24px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--black)',
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>
          Harsh Singh &bull; B.Tech IT &bull; VIT Vellore
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)' }}>
          Vellore, TN
        </span>
      </footer>

      {/* CHAT OVERLAY */}
      {chatOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
          padding: '24px', animation: 'fadeUp 0.2s ease',
        }} onClick={(e: MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) setChatOpen(false);
        }}>
          <div style={{
            width: '420px', height: '650px', background: 'var(--black)',
            border: '1px solid var(--border)', borderRadius: '16px',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.8)', animation: 'fadeUp 0.3s ease',
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--card-bg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--accent)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontFamily: 'var(--display)', fontSize: '14px',
                  color: 'var(--white)', fontWeight: 700,
                }}>HS</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--white)' }}>Harsh&apos;s AI Assistant</div>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: 'var(--accent)', animation: 'pulse 2s infinite', display: 'inline-block',
                    }} />
                    online
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button title="Set OpenRouter API Key"
                  onClick={() => setShowKeyInput(prev => !prev)}
                  onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  style={{
                    fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)',
                    padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '4px',
                    cursor: 'pointer', background: 'transparent', transition: 'all 0.2s',
                  }}>key</button>
                <button onClick={clearChat}
                  onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  style={{
                    fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)',
                    padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '4px',
                    cursor: 'pointer', background: 'transparent', transition: 'all 0.2s',
                  }}>clear</button>
                <button onClick={() => setChatOpen(false)} style={{
                  color: 'var(--muted)', fontSize: '20px', lineHeight: '1',
                  padding: '4px', background: 'transparent', cursor: 'pointer',
                }}>x</button>
              </div>
            </div>

            {showKeyInput && (
              <div style={{ padding: '12px 24px', background: '#0d0d0b', borderBottom: '1px solid var(--border)' }}>
                <input type="password" placeholder="sk-or-... (OpenRouter API key)"
                  value={apiKey} onChange={e => setApiKey(e.target.value)}
                  style={{
                    width: '100%', background: 'var(--card-bg)', border: '1px solid var(--border)',
                    borderRadius: '4px', padding: '8px 12px', color: 'var(--white)',
                    fontFamily: 'var(--mono)', fontSize: '12px', outline: 'none',
                  }} />
              </div>
            )}

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '20px',
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'var(--accent)', margin: '0 auto 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--display)', fontSize: '20px', color: 'var(--white)', fontWeight: 700,
                  }}>HS</div>
                  <div style={{ fontSize: '15px', marginBottom: '6px', fontWeight: 500, color: 'var(--white)' }}>
                    Hey! I&apos;m Harsh&apos;s AI.
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.6 }}>
                    Ask me anything about Harsh&apos;s skills, projects, or availability for internships.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {SUGGESTED_QUESTIONS.map(q => (
                      <button key={q} onClick={() => sendMessage(q)}
                        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                          e.currentTarget.style.borderColor = 'var(--accent)';
                          e.currentTarget.style.color = 'var(--white)';
                        }}
                        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.color = 'var(--muted)';
                        }}
                        style={{
                          background: 'var(--card-bg)', border: '1px solid var(--border)',
                          borderRadius: '8px', padding: '10px 14px',
                          fontFamily: 'var(--body)', fontSize: '13px', color: 'var(--muted)',
                          textAlign: 'left', transition: 'all 0.2s', cursor: 'pointer', width: '100%',
                        }}>{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map(msg => (
                <ChatMessage key={msg.id} id={msg.id} role={msg.role} content={msg.content} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--card-bg)' }}>
              <div style={{
                display: 'flex', gap: '10px', alignItems: 'flex-end',
                background: 'var(--black)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '10px 14px',
              }}>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown} placeholder="Ask anything about Harsh..." rows={1}
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: 'var(--white)', fontFamily: 'var(--body)', fontSize: '14px',
                    lineHeight: '1.5', resize: 'none', maxHeight: '100px',
                  }} />
                <button onClick={handleSend} disabled={!input.trim() || isLoading}
                  style={{
                    background: input.trim() && !isLoading ? 'var(--accent)' : '#2a2a24',
                    color: 'var(--white)', width: '32px', height: '32px',
                    borderRadius: '6px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0, fontSize: '16px', border: 'none',
                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                  }}>
                  {isLoading ? '...' : '^'}
                </button>
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', textAlign: 'center', marginTop: '8px' }}>
                Enter to send &bull; Shift+Enter for newline
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
