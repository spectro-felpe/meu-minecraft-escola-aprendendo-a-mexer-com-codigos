class TeamPredicate {
  constructor(team = "") {
    this.team = team;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    // Obtém o time da entidade (seja via método getTeam() ou propriedade team)
    const team = typeof entity.getTeam === 'function' 
      ? entity.getTeam() 
      : entity.team;

    if (!team) return false;

    // Obtém o nome do time
    const teamName = typeof team.getName === 'function' 
      ? team.getName() 
      : team.name;

    return this.team === teamName;
  }
}

window.TeamPredicate = TeamPredicate;
