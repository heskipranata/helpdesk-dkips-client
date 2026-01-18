import Navbar from "../components/Navbar";
import LayananComponent from "../components/Layanan";
import AuthGuard from "../components/AuthGuard";

export default function Layanan() {
  return (
    <>

      <Navbar />
    <AuthGuard requireAuth={true}>
      <LayananComponent />
    </AuthGuard>
    </>
  );
}
