import { useEffect, useState } from 'react';
import { InviteUserForm } from '../components/InviteUserForm';
import { TeamMemberList } from '../components/TeamMemberList';
import { TeamPersonaTable } from '../components/TeamPersonaTable';
import { getTeamMembers, getTeamPersonas, User, Persona } from '../utils/api';

export default function TeamPage() {
  const [members, setMembers] = useState<User[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);

  async function load() {
    try {
      const [m, p] = await Promise.all([getTeamMembers(), getTeamPersonas()]);
      setMembers(m);
      setPersonas(p);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Team</h1>
      <InviteUserForm onInvited={load} />
      <section>
        <h2 className="mb-2 text-lg font-medium">Members</h2>
        <TeamMemberList members={members} />
      </section>
      <section>
        <h2 className="mb-2 text-lg font-medium">Personas</h2>
        <TeamPersonaTable personas={personas} />
      </section>
    </div>
  );
}
