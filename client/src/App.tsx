import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState<File>();
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    const formData = new FormData();
    formData.append("file", file!);
    try {
      const res = await fetch("http://localhost:4000/geojson2shapefile", {
        method: "POST",
        body: formData,
        headers: {},
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.txt");
      document.body.appendChild(link);
      link.click();
      setStatus("success");
    } catch (err) {
      console.log(err);
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      setFile(e.currentTarget.files[0]);
    }
  };

  const buttonColor =
    status === "success" ? "green" : status === "error" ? "red" : "inherit";

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} accept=".txt" required />
        <button
          type="submit"
          style={{
            backgroundColor: buttonColor,
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
