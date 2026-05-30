const teamMembers = [
  { id: "1", name: "Admin", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop", bio: "Leading the team with 5+ years of MLBB trading experience.", discord: "admin#0001", twitter: "https://twitter.com/", instagram: "https://instagram.com/", facebook: "https://facebook.com/" },
  { id: "2", name: "Sarah Chen", role: "Account Specialist", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop", bio: "Expert in account verification and quality assurance.", discord: "sarah#0002", twitter: "https://twitter.com/", instagram: "https://instagram.com/", facebook: "https://facebook.com/" },
  { id: "3", name: "Mike Johnson", role: "Customer Support", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop", bio: "Available 24/7 to assist with your purchase via Discord.", discord: "mike#0003", twitter: "https://twitter.com/", instagram: "https://instagram.com/", facebook: "https://facebook.com/" },
  { id: "4", name: "Aisha Patel", role: "Payment Coordinator", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop", bio: "Handles all Nepal payment wallet transactions securely.", discord: "aisha#0004", twitter: "https://twitter.com/", instagram: "https://instagram.com/", facebook: "https://facebook.com/" },
];

export function Team() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <p className="inline-block px-4 py-1.5 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-xs font-black tracking-widest uppercase mb-6">
            The Crew
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            <span className="text-white">Meet the </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">Team.</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg font-medium">
            Dedicated professionals committed to providing the most secure and reliable Mobile Legends account trading experience in Nepal.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="group flex flex-col">
              
              {/* Image Container */}
              <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] mb-6 relative shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-[var(--text-primary)]/10 z-10 group-hover:opacity-0 transition-opacity duration-500" />
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out"
                />
                
                {/* Fixed Contact Badge (Discord + Socials + Contact button) */}
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-0 opacity-100 z-20">
                   <div className="bg-[#0f1724] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-3 whitespace-nowrap">
                     <div className="flex items-center gap-2">
                       <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" /></svg>
                       <span>{member.discord}</span>
                     </div>

                     <div className="flex items-center gap-2">
                       <a href={member.twitter} target="_blank" rel="noreferrer" className="hover:opacity-80">
                         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.92c-.66.29-1.37.48-2.11.57a3.68 3.68 0 0 0 1.62-2.03c-.72.42-1.53.72-2.39.88A3.67 3.67 0 0 0 12.04 7.6c0 .29.03.58.1.85-3.05-.15-5.76-1.61-7.58-3.84-.32.55-.5 1.2-.5 1.89 0 1.31.67 2.46 1.69 3.13-.62-.02-1.2-.19-1.71-.47v.05c0 1.82 1.3 3.34 3.03 3.69-.32.09-.65.14-.99.14-.24 0-.48-.02-.71-.07.48 1.5 1.87 2.59 3.51 2.62A7.37 7.37 0 0 1 3 19.54 10.4 10.4 0 0 0 8.97 21c6.32 0 9.79-5.23 9.79-9.76v-.44c.67-.49 1.24-1.09 1.7-1.78-.62.28-1.28.47-1.96.56z"/></svg>
                       </a>
                       <a href={member.instagram} target="_blank" rel="noreferrer" className="hover:opacity-80">
                         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zM18.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                       </a>
                       <a href={member.facebook} target="_blank" rel="noreferrer" className="hover:opacity-80">
                         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2v-2.9h2.2V9.2c0-2.2 1.3-3.4 3.3-3.4.96 0 1.97.17 1.97.17v2.2h-1.12c-1.1 0-1.44.68-1.44 1.37v1.7h2.46l-.39 2.9h-2.07v7A10 10 0 0 0 22 12z"/></svg>
                       </a>
                     </div>

                     <a href="/api/auth/discord" className="ml-3 inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] px-3 py-1.5 rounded-full text-white text-xs font-bold">
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/></svg>
                       Message
                     </a>
                   </div>
                 </div>
              </div>
              
              {/* Text Content */}
              <div className="text-center px-4">
                <h3 className="font-black text-xl text-[var(--text-primary)] mb-1">{member.name}</h3>
                <p className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-4">{member.role}</p>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                  {member.bio}
                </p>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
