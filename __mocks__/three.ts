// __mocks__/three.ts
export const WebGLRenderer = jest.fn().mockImplementation(() => ({
  setSize: jest.fn(),
  setPixelRatio: jest.fn(),
  render: jest.fn(),
  dispose: jest.fn(),
  domElement: document.createElement('canvas'),
}))
export const PerspectiveCamera = jest.fn().mockImplementation(() => ({
  position: { x: 0, y: 0, z: 0, set: jest.fn() },
  aspect: 1,
  updateProjectionMatrix: jest.fn(),
}))
export const Scene = jest.fn().mockImplementation(() => ({
  add: jest.fn(),
  remove: jest.fn(),
  traverse: jest.fn(),
}))
export const AmbientLight = jest.fn().mockImplementation(() => ({}))
export const DirectionalLight = jest.fn().mockImplementation(() => ({
  position: { set: jest.fn() },
}))
export const MeshStandardMaterial = jest.fn().mockImplementation(() => ({}))
export const Color = jest.fn()
export const Box3 = jest.fn().mockImplementation(() => ({
  setFromObject: jest.fn().mockReturnThis(),
  getSize: jest.fn().mockImplementation((target: { x: number; y: number; z: number }) => {
    target.x = 500
    target.y = 100
    target.z = 20
    return target
  }),
}))
export const Vector3 = jest.fn().mockImplementation(() => ({ x: 0, y: 0, z: 0 }))
export const Group = jest.fn().mockImplementation(() => ({
  position: { x: 0, y: 0, z: 0, set: jest.fn() },
  rotation: { x: 0, y: 0, z: 0 },
  add: jest.fn(),
  remove: jest.fn(),
  scale: { set: jest.fn(), x: 1, y: 1, z: 1 },
  children: [],
}))
export const Mesh = jest.fn().mockImplementation(() => ({
  material: {},
  name: '',
}))
