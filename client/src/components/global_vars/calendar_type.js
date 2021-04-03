import React from 'react'
import { FaBug,FaStop, FaMagic, FaBrain} from 'react-icons/fa';
import { MdDone } from 'react-icons/md';
import {RiFileSearchFill} from 'react-icons/ri'
import {DiGitBranch} from 'react-icons/di'
import {AiOutlineFileDone} from 'react-icons/ai'
import {BiNotification} from 'react-icons/bi'
import {MdPeople} from 'react-icons/md'
import {GoTasklist} from 'react-icons/go'
const calendar_type  = [
    { value: 'reminder', label: <div className="select-element"><BiNotification fill="crimson"/><div className="select-text">Reminder</div></div>, icon: <BiNotification fill="crimson"/> },
    { value: 'meeting', label: <div className="select-element"><MdPeople fill="orange"/><div className="select-text">Meeting</div></div>, icon: <MdPeople fill="orange"/> },
    { value: 'todo', label: <div className="select-element"><GoTasklist fill="#00c407"/><div className="select-text">To do</div></div>, icon: <GoTasklist fill="#00c407"/> },
    { value: 'blank', label: <div className="select-element"><FaStop fill="grey"/><div className="select-text">Blank</div></div>, icon: <FaStop fill="grey"/> }
];
export default calendar_type
