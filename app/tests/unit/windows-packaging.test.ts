import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const packagePath = resolve(dirname(fileURLToPath(import.meta.url)), '../../package.json');
const appDirectory = dirname(packagePath);
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

describe('Windows NewsPop packaging configuration', () => {
  it('preserves the stable application identity and NewsPop product name', () => {
    expect(packageJson.build.appId).toBe('com.signaldesk.news');
    expect(packageJson.build.productName).toBe('NewsPop');
  });

  it('creates NewsPop shortcuts on the desktop and in the Start Menu', () => {
    expect(packageJson.build.nsis.createDesktopShortcut).toBe(true);
    expect(packageJson.build.nsis.createStartMenuShortcut).toBe(true);
    expect(packageJson.build.nsis.shortcutName).toBe('NewsPop');
  });

  it('uses the expected existing ICO asset for Windows packaging', () => {
    const configuredIconPath = packageJson.build.win.icon;
    const expectedIconPath = 'build/icon.ico';

    expect(configuredIconPath).toBe(expectedIconPath);
    expect(resolve(appDirectory, configuredIconPath)).toBe(resolve(appDirectory, expectedIconPath));
    expect(existsSync(resolve(appDirectory, configuredIconPath))).toBe(true);
    expect(packageJson.build.nsis.installerIcon).toBe(configuredIconPath);
    expect(packageJson.build.nsis.uninstallerIcon).toBe(configuredIconPath);
    expect(packageJson.build.nsis.installerHeaderIcon).toBe(configuredIconPath);
  });

  it('uses the same ICO for the Electron window and preserves matching SVG source artwork', () => {
    const iconPath = packageJson.build.win.icon;
    const mainProcess = readFileSync(resolve(appDirectory, 'main/index.ts'), 'utf8');
    const svgPath = resolve(appDirectory, 'build/newspop-icon.svg');
    const svgArtwork = readFileSync(svgPath, 'utf8');
    const ico = readFileSync(resolve(appDirectory, iconPath));

    expect(mainProcess).toContain("icon: join(__dirname, '../../build/icon.ico')");
    expect(existsSync(svgPath)).toBe(true);
    expect(svgArtwork).toContain('fill="#c94f3d"');
    expect(svgArtwork).toContain('fill="#fff"');
    expect(svgArtwork).toContain('fill="#ffd34f"');
    expect(ico.readUInt16LE(0)).toBe(0);
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBeGreaterThan(0);
  });
});