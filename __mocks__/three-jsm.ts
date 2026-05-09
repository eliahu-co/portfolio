export const GLTFLoader = jest.fn().mockImplementation(() => ({
  setDRACOLoader: jest.fn(),
  load: jest.fn(),
}))
export const DRACOLoader = jest.fn().mockImplementation(() => ({
  setDecoderPath: jest.fn(),
}))
