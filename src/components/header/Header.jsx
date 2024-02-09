import "./Header.css"
import logo from "../assets/download.png"


export const Header = () => {
  return (
    <div className="header">
        <div className="headerContainer">
          <div className="headerImgText">
          <img src={logo} height={'20px'} width={'20px'}/>
            <span className="logo">cleartrip</span>
          </div>
            <div className="headerItems">
                <button className="headerButton">Log in/Sign up</button>
            </div>
        </div>
    </div>
  )
}
export default Header