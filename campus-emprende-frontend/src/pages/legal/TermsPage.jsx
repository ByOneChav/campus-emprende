import { Link } from "react-router-dom";

export default function TermsPage() {

  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-slate-100">

        <h1 className="text-3xl font-bold text-center">
          Términos y Condiciones
        </h1>

        <p className="mt-2 text-slate-500 text-center">
          Campus Emprende - Versión 1.0
        </p>

        <a
          href="/legal/Terminos_y_Condiciones_Campus_Emprende.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 w-full max-w-xs text-center bg-blue-600 text-white py-3 rounded-xl"
        >
          Ver documento
        </a>

        <a
          href="/legal/Terminos_y_Condiciones_Campus_Emprende.pdf"
          download
          className="mt-3 w-full max-w-xs text-center border py-3 rounded-xl"
        >
          Descargar PDF
        </a>

        <Link
          to="/auth/register"
          className="mt-6 text-blue-600"
        >
          ← Volver al registro
        </Link>

      </div>
    );
  }

  return (
    <iframe
      src="/legal/Terminos_y_Condiciones_Campus_Emprende.pdf"
      className="w-full h-screen"
      title="Términos y Condiciones"
    />
  );
}