import _head from 'lodash.head';
import util from 'util';
import { exec } from 'child_process';

const asyncExec = util.promisify(exec);

const LEVELS = ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'];

const bump = async () => {
	let level = _head(process.argv.slice(2)) || '';
	level = level.toLowerCase();
	level = LEVELS.includes(level) ? level : 'patch';
	try {
		await asyncExec(`npm version ${level} --allow-same-version`);
	} catch (e) {
		throw new Error(e);
	}
};

bump()
	.then((version) => {
		return version;
	})
	.catch((e) => console.error(e));
