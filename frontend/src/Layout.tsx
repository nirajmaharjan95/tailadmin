import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

interface Iprops {
  children: React.ReactNode;
}

const Layout = ({ children }: Iprops) => {
  return (
    <div>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <Header />
          <main>
            <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
