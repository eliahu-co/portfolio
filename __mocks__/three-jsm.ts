// __mocks__/three-jsm.ts
export const GLTFLoader = jest.fn().mockImplementation(() => ({
  setDRACOLoader: jest.fn(),
  load: jest.fn().mockImplementation(
    (_url: string, onLoad?: (gltf: object) => void) => {
      if (onLoad) {
        onLoad({
          scene: {
            traverse: jest.fn(),
          },
        })
      }
    }
  ),
}))
export const DRACOLoader = jest.fn().mockImplementation(() => ({
  setDecoderPath: jest.fn(),
}))
