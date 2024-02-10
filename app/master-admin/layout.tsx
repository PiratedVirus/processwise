export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-100 flex h-screen flex-col md:flex-row md:overflow-hidden">
    <div className="mb-4 mr-4 ml-4 bg-white  rounded pb-6 flex-grow md:mb-12 md:mr-12 md:ml-12 md:overflow-y-auto">
      {children}
    </div>
  </div>
  );
}