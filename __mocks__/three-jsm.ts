// __mocks__/three-jsm.ts
export const GLTFLoader = jest.fn().mockImplementation(() => ({
  setDRACOLoader: jest.fn(),
  // The real loader resolves asynchronously. Mount tests only need to verify
  // that starting a load does not throw, so leave callbacks pending.
  load: jest.fn(),
}))
export const DRACOLoader = jest.fn().mockImplementation(() => ({
  setDecoderPath: jest.fn(),
}))
