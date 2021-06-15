import React from 'react'
import { FaStop} from 'react-icons/fa';
import {GiFallingStar} from 'react-icons/gi'
import {HiUserGroup} from 'react-icons/hi'
import {RiHandCoinFill} from 'react-icons/ri'
const event_type  = [
    // { value: 'bug', label:  <div className="select-element"><FaBug fill="red"/><div className="select-text">Bug</div></div>,icon:<FaBug fill="red"/> },
    // { value: 'task', label: <div className="select-element"><MdDone  fill="green"/><div className="select-text">Task</div></div>,icon: <MdDone  fill="green"/> },
    // { value: 'feature', label: <div className="select-element"><FaMagic fill="green"/><div className="select-text">Feature</div></div>, icon: <FaMagic fill="green"/> },
    // { value: 'idea', label: <div className="select-element"><FaBrain fill="pink"/><div className="select-text">Idea</div></div>, icon: <FaBrain fill="pink"/> },
    { value: 'blank', label: <div className="select-element"><FaStop fill="grey"/><div className="select-text">Blank</div></div>, icon: <FaStop fill="grey"/> },
    { value: 'idea', label: <div className="select-element"><GiFallingStar fill="orange"/><div className="select-text">Сoncert</div></div>, icon: <GiFallingStar fill="orange"/> },
    { value: 'meeting', label: <div className="select-element"><HiUserGroup fill="teal"/><div className="select-text">Meeting</div></div>, icon: <HiUserGroup fill="teal"/> },
    { value: 'workshop', label: <div className="select-element"><RiHandCoinFill fill="#4169E1"/><div className="select-text">Workshop</div></div>, icon: <RiHandCoinFill fill="#4169E1"/> },
     
];
export default event_type
