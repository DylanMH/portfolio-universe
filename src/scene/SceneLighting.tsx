export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#8b5cf6" distance={120} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={0.4} color="#22d3ee" />
    </>
  )
}
