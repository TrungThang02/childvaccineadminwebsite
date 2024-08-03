import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList
}from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import logo from "../assets/logo.jpg";


const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(true);
    const toggle = () => setIsOpen (!isOpen);
   
    const menuItem=[
        {
            path:"/",
            name:"Trang chủ",
            icon:<FaTh/>
        },
        {
            path:"/about",
            name:"Quản lý lịch tiêm",
            icon:<FaUserAlt/>
        },
        {
            path:"/analytics",
            name:"Lịch tiêm đã đặt",
            icon:<FaRegChartBar/>
        },
        {
            path:"/comment",
            name:"Thông tin vắc xin",
            icon:<FaCommentAlt/>
        },
        {
            path:"/product",
            name:"Tin tức",
            icon:<FaShoppingBag/>
        },
        {
            path:"/productList",
            name:"Product List",
            icon:<FaThList/>
        }
    ]
    return (
        <div className="container">
           <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar">
               <div className="top_section">
                   <div style={{display: isOpen ? "block" : "none"}} className="logo">
                   <img className='logo' src={'https://www.aha.org/sites/default/files/2021-04/logo-vacciNATION-color.png'} alt="Logo"/>

                  
                   </div>
                   <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                       <FaBars onClick={toggle}/>
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