import pkgJson from "../package.json";
import {
  SCRIPT_DESCRIPTION,
  SCRIPT_ID,
  SCRIPT_FILENAME,
  SCRIPT_NAME,
  SCRIPT_VERSION,
} from "../src/consts";
import customScript from "../src/main";

test("script constants are sane", () => {
  expect(SCRIPT_DESCRIPTION).not.toBeNull();
  expect(SCRIPT_DESCRIPTION).not.toBeUndefined();
  expect(SCRIPT_DESCRIPTION).toStrictEqual(pkgJson.description);

  expect(SCRIPT_ID).not.toBeNull();
  expect(SCRIPT_ID).not.toBeUndefined();
  expect(SCRIPT_ID).toStrictEqual(pkgJson.name);

  expect(SCRIPT_FILENAME).not.toBeNull();
  expect(SCRIPT_FILENAME).not.toBeUndefined();
  // `SCRIPT_FILENAME` includes the ".js" file extension to assist the update mechanism, while `package.json.scriptOutputName` does not.
  expect(SCRIPT_FILENAME.endsWith(".js")).toBeTruthy();
  expect(SCRIPT_FILENAME.startsWith(pkgJson.scriptOutputName)).toBeTruthy();

  expect(SCRIPT_NAME).not.toBeNull();
  expect(SCRIPT_NAME).not.toBeUndefined();

  expect(SCRIPT_VERSION).not.toBeNull();
  expect(SCRIPT_VERSION).not.toBeUndefined();
  expect(SCRIPT_VERSION).toStrictEqual(pkgJson.version);
});

test("script manifest is sane", async () => {
  const manifest = await customScript.getScriptManifest();
  expect(manifest).not.toBeNull();
  expect(manifest).not.toBeUndefined();

  expect(manifest.description).not.toBeNull();
  expect(manifest.description).not.toBeUndefined();
  expect(manifest.description).toStrictEqual(SCRIPT_DESCRIPTION);

  expect(manifest.name).not.toBeNull();
  expect(manifest.name).not.toBeUndefined();
  expect(manifest.name).toStrictEqual(SCRIPT_NAME);

  expect(manifest.version).not.toBeNull();
  expect(manifest.version).not.toBeUndefined();
  expect(manifest.version).toStrictEqual(SCRIPT_VERSION);
});

test("custom script is the main default export", () => {
  expect(customScript).not.toBeUndefined();
  expect(customScript.run).not.toBeUndefined();
  expect(customScript.getScriptManifest).not.toBeUndefined();
  expect(customScript.getDefaultParameters).not.toBeUndefined();
});
