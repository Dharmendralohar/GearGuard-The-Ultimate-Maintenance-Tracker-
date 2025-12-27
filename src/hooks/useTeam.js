const MOCK_TEAMS = [
    { id: 'tm1', name: 'Mechanics', members: ['t1', 't2'] },
    { id: 'tm2', name: 'Electricians', members: ['t3'] },
    { id: 'tm3', name: 'IT Support', members: ['t4'] },
];

const MOCK_MEMBERS = [
    { id: 't1', name: 'Alice Johnson', role: 'Technician', teamId: 'tm1' },
    { id: 't2', name: 'Bob Smith', role: 'Technician', teamId: 'tm1' },
    { id: 't3', name: 'Charlie Davis', role: 'Technician', teamId: 'tm2' },
    { id: 't4', name: 'Diana Prince', role: 'Technician', teamId: 'tm3' },
    { id: 'm1', name: 'Eve Manager', role: 'Manager', teamId: null },
];

export const useTeam = () => {
    return {
        teams: MOCK_TEAMS,
        members: MOCK_MEMBERS,
        getTeamMembers: (teamId) => MOCK_MEMBERS.filter(m => m.teamId === teamId),
        getMember: (id) => MOCK_MEMBERS.find(m => m.id === id)
    };
};
