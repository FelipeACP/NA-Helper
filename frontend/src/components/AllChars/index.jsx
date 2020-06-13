import React from 'react';
import setHeaders from '../../utils/setHeaders';

import CharInfo from '../CharInfo';
import Menu from '../Menu';
import CharFilter from '../Filters/charFilter';
import SkillFilter from '../Filters/skillFilter';
import SearchBar from '../SearchBar/SearchBar';
import DamageCalc from '../DamageCalc';

class AllChars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chars: {byId:{}, listIds: []},
      filteredChars: [],
      id: '5ec26309e880d824b803c6b3',
      active: 'charInfo',
      calc: false,
      rmdKey: "0"
    };
    this.handleAvatarClick = this.handleAvatarClick.bind(this);
    this.getInfoFromMenu = this.getInfoFromMenu.bind(this);
    this.getSkillFilters = this.getSkillFilters.bind(this);
    this.getCharFilters = this.getCharFilters.bind(this);
    this.getSearchResult = this.getSearchResult.bind(this);
    this.changeCalcVisibility = this.changeCalcVisibility.bind(this);
    this.addClassesToFiletrs = this.addClassesToFiletrs.bind(this);
    this.addClassesToFilters2 = this.addClassesToFilters2.bind(this);
    this.getThroughSkills = this.getThroughSkills.bind(this);
  }

  getData = async () => {
    const cha = await fetch('/api/chars', setHeaders()).then(response => response.json());
    var byId = cha.reduce((acc, c) => {
      acc[c._id] = c;
      return acc
     }, {}  )
    var listIds = Object.keys(byId);

    this.addClassesToFiletrs(cha);

    this.setState({ chars: {byId, listIds }, filteredChars: listIds });
  };

  componentDidMount() {
    this.getData();
  }

  addClassesToFiletrs(cha) {
    let classes;
    cha.map(x => (
      classes = this.getThroughSkills(x),
      this.addClassesToFilters2(x, classes)
    ))
  }

  getThroughSkills(char) {
    let gottenClasses = [];
    for (let i = 0; i < 4; i++) {
      let skillClasses = char.skills[i].skillClasses.split(", ");
      for (let i = 0; i < skillClasses.length; i++) {
        gottenClasses.push(skillClasses[i]);
      }
    }
    if (char.alternateSkills.length > 0) {
      for (let i = 0; i < char.alternateSkills.length; i++) {
        let skillClasses = char.alternateSkills[i].skillClasses.split(", ");
        for (let i = 0; i < skillClasses.length; i++) {
          gottenClasses.push(skillClasses[i]);
        }
      }
    }
    let unique = [...new Set(gottenClasses)];
    return unique
  }

  addClassesToFilters2(x, classes) {
    for (let i = 0; i < classes.length; i++) {
      x.skillFilter.push(classes[i]);
    }
  }

  handleAvatarClick(e) {
    this.setState({ id: e.target.id, active: 'charInfo' });
  }

  getInfoFromMenu(whatIsActive) {
    this.setState({
      active: whatIsActive,
      filteredChars: this.state.chars.listIds,
      rmdKey: Math.floor(Math.random() * 99999).toString()
    });
  }

  getSearchResult(term) {
     const filterChars = this.state.chars.listIds.filter(id => {
      if (this.state.chars.byId[id].name.toLowerCase().includes(term.toLowerCase())) 
        return true;
      return false;
    });
    this.setState({ filteredChars: filterChars });
  }

  getSkillFilters(includeAbilities, excludeAbilities) {
    const { chars } = this.state;
    const filterChars = chars.listIds.filter(id =>
        includeAbilities.every(ability => chars.byId[id].skillFilter.includes(ability)) &&
        excludeAbilities.every(ability => !chars.byId[id].skillFilter.includes(ability)),
    );
    this.setState({ filteredChars: filterChars });
  }

  getCharFilters(includeFilters, excludeFilters) {
    const { chars } = this.state;
    const filterChars = chars.listId.filter(id =>
        includeFilters.every(filter => chars.byId[id].charFilter.includes(filter)) &&
        excludeFilters.every(filter => !chars.byId[id].charFilter.includes(filter)),
    );
    this.setState({ filteredChars: filterChars });
  }

  changeCalcVisibility() {
    let actualCalc = this.state.calc;
    this.setState({ calc: !actualCalc });
  }

  render() {
    const { chars, id, filteredChars } = this.state;
    return (
      <>
        <div className="chars">
          {filteredChars.map(id => (
            <img
              onClick={this.handleAvatarClick}
              key={id}
              alt={chars.byId[id].name}
              src={chars.byId[id].avatar}
              id={id}
              className="facepic"
            />
          ))}
        </div>
        <div className="searchBar">
          <SearchBar callbackFromParent={this.getSearchResult} />
        </div>
        <div className="bottomThings">
          <div className="buttons">
            <Menu callbackFromParent={this.getInfoFromMenu} changeCalcVisibility={this.changeCalcVisibility} />
          </div>
          <div className="charInfo">
            {this.state.active === 'charInfo' && <CharInfo charInfo={chars.byId[id]} />}
            {this.state.active === 'filters' && <CharFilter key={this.state.rmdKey} callbackFromParent={this.getCharFilters} />}
            {this.state.active === 'skillFilters' && <SkillFilter key={this.state.rmdKey} callbackFromParent={this.getSkillFilters} />}
          </div>
        </div>
        {this.state.calc && <DamageCalc />}
        <div className="footer">Made by Neji1113 / Patryqss</div>
      </>
    );
  }
}

export default AllChars;
