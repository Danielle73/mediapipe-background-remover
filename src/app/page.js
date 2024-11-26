import CameraBackgroundRemover from "../../components/CameraBackgroundRemover";

export default function Home() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Background Remover App</h1>
      <p>Test out the camera and background removal feature below:</p>
      <CameraBackgroundRemover />
    </div>
  );
}
