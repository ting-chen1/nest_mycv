import { rm } from 'fs/promises';

global.beforeEach(async () => {
  try {
    await rm(`${__dirname}/../test.sqlite`)
  } catch (error) {

  }
})