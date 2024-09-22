import Sidebar from "./Sidebar"
import Header from "./Header";
const Main = ({ children }) => {
  return (
    <div className="wrapper">
      <Sidebar />
      <div id="content">
        <Header />
        <div className="px-4">
        {children && children}
        </div>
      </div>
    </div>
  );
};

export default Main;