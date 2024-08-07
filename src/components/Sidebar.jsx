import React, { useState } from 'react';
import {
    FaTh,
    FaOutdent ,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList,
    FaRegCalendarAlt ,
    FaRegCalendarCheck ,
    FaExclamationCircle ,
    FaRegNewspaper 
}from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import logo from "../assets/logo.jpg";



const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(true);
    const toggle = () => setIsOpen (!isOpen);
   
    const menuItem=[
        {
            path:"/",
            name:"Quản lý lịch tiêm",
            icon:<FaRegCalendarAlt />
        },
        {
            path:"/makeappointments",
            name:"Lịch tiêm đã đặt",
            icon:<FaRegCalendarCheck />
        },
        {
            path:"/user",
            name:"Quản lý người dùng",
            icon:<FaUserAlt/>
        },
        {
            path:"/vaccineinfo",
            name:"Thông tin vắc xin",
            icon:<FaExclamationCircle />
        },
        {
            path:"/news",
            name:"Tin tức",
            icon:<FaRegNewspaper />
        },
     
    ]
    return (
  
        <div className="container">
           <div style={{width: isOpen ? "300px" : "50px"}} className="sidebar">
               <div className="top_section">
                   <div style={{display: isOpen ? "block" : "none"}} className="logo">
                   <img className='logo' src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIWGtokeqmj8-AxO4klqRvO2U22jq0X9mJuU7p7O4RYtH-0kW0GtoVif9l4aBQ_AdWow&usqp=CAU'} alt="Logo"/>

                  
                   </div>
                 
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }
           </div>
           <main>{children}</main>
        </div>
  
    );
};

export default Sidebar;