import React from 'react';
import DescriptionWindow from './descriptionWindow';

class CharInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Uzumaki Naruto',
      clas: '',
      skillPage: 0,
      cst: [],
      coold: '',
      descr:
        'A Genin from Team 7, Naruto is an orphan with the goal to one day become Hokage. Using his signature move, Shadow Clones, Naruto is able to perform powerful moves such as the Uzumaki Naruto Combo and the Rasengan.',
    };
    this.handleSkillClick = this.handleSkillClick.bind(this);
    this.handleAvatarClick = this.handleAvatarClick.bind(this);
    this.handleAlternate = this.handleAlternate.bind(this);
    this.handleMission = this.handleMission.bind(this);
  }

  handleSkillClick(e) {
    const { charInfo } = this.props;
    let sDesc = charInfo.skills.find(x => x.skillName === e.target.id).skillDescription;
    let sClass = charInfo.skills.find(x => x.skillName === e.target.id).skillClasses;
    let sCost = charInfo.skills.find(x => x.skillName === e.target.id).skillCost;
    let sCool = charInfo.skills.find(x => x.skillName === e.target.id).skillCooldown;

    this.setState({ name: e.target.id, descr: sDesc, clas: sClass, cst: sCost, coold: sCool });
  }

  handleAvatarClick() {
    this.setState({
      name: this.props.charInfo.name,
      descr: this.props.charInfo.description,
      coold: 'None',
      clas: ' ',
      cst: ' ',
    });
  }

  handleAlternate() {
    const { skillPage, char, originalSkill } = this.state
    const { alternateSkills, skills } = char;
    // Order skillsets by page and normalize every element by skillReplace - 1
    const { arr } = alternateSkills.reduce((p, c, i) => {
      if (!Object.keys(p.el).includes((c.skillReplace - 1).toString())) {
        let arr = [...p.arr]
        let el = { ...p.el, [c.skillReplace - 1]: c };
        arr[p.index] = el
        return { el, arr, prevEl: c, index: p.index }
      }
      let el = { [c.skillReplace - 1]: c }
      return { el, arr: [...p.arr, el], prevEl: c, index: p.index + 1 }
    }, { el: {}, arr: [], prevEl: {}, index: 0 })
    //normalize the skill array
    const normSkills = { ...skills };
    const skillSets = [...arr, originalSkill];
    const currentChar = {
      ...this.state.char,
      skills: Object.values({ ...normSkills, ...skillSets[skillPage] }),
      skillPage: skillPage
    };
    this.setState({ char: currentChar, skillPage: (skillPage + 1) % skillSets.length });
  }

  handleMission() {
    let mDesc = '';
    for (let i = 1; i < this.props.charInfo.mission.length; i++) {
      mDesc = mDesc + '\n • ' + this.props.charInfo.mission[i];
    }

    this.setState({ name: this.props.charInfo.mission[0], descr: mDesc, coold: 'None', clas: ' ', cst: ' ' });
  }

  render() {
    const { charInfo } = this.props;
    return (
      charInfo ? <div className="charDiv">
        <div className="avatarAndChakra">
          <img
            className="avatar"
            alt="avatar"
            name={charInfo.name}
            desc={charInfo.description}
            src={charInfo.avatar}
          />
          <div className="chakras">
            <div className="chakraGroup">
              <div className="taijutsu"></div> x{charInfo.chakraUsed[0]}
            </div>
            <div className="chakraGroup">
              <div className="bloodline"></div> x{charInfo.chakraUsed[1]}
            </div>
            <div className="chakraGroup">
              <div className="ninjutsu"></div> x{charInfo.chakraUsed[2]}
            </div>
            <div className="chakraGroup">
              <div className="genjutsu"></div> x{charInfo.chakraUsed[3]}
            </div>
            <div className="chakraGroup">
              <div className="random"></div> x{charInfo.chakraUsed[4]}
            </div>
          </div>
        </div>
        <div className="skills">
          {charInfo.skills &&
            charInfo.skills.map(x => (
              <img
                onClick={this.handleSkillClick}
                key={x.skillName}
                alt={x.skillName}
                src={x.skillPics}
                id={x.skillName}
                className="skillpic"
              />
            ))}
        </div>
        <div className="additionalButtons">
          {charInfo.alternateSkills.length > 0 && (
            <div /* onClick={this.handleAlternate} */ className="button">
              Alter
            </div>
          )}
          {charInfo.mission.length > 0 && (
            <div onClick={this.handleMission} className="button">
              Mission
            </div>
          )}
        </div>
        <DescriptionWindow
          name={this.state.name}
          desc={this.state.descr}
          cost={this.state.cst}
          classes={this.state.clas}
          cooldown={this.state.coold}
        />
      </div>
        :
        <div class="loading">
          <p>Loading...</p>
        </div>
    );
  }
}

export default CharInfo;
