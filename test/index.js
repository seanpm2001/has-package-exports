'use strict';

var test = require('tape');
var semver = require('semver');
var hasPackageExports = require('has-package-exports');
// eslint-disable-next-line global-require
var spawnSync = typeof window === 'undefined' && require('child_process').spawnSync;

test('has-package-exports', function (t) {
	var expected = typeof window === 'undefined' ? semver.satisfies(process.version, '>= 13') : null;
	t.equal(hasPackageExports, expected, 'module exports expected value');

	t.test('experimental warning', { skip: !spawnSync || process.env.RECURSION }, function (st) {
		st.plan(1);

		var res = spawnSync('node', ['test'], {
			env: { PATH: process.env.PATH, RECURSION: 'recursion' }
		});
		if (semver.satisfies(process.version, '~13.7 || ~13.8 || ~13.9 || =12.16.0')) {
			st.ok(String(res.stderr), 'stderr has an experimental warning in it');
		} else {
			st.equal(String(res.stderr), '', 'stderr is empty');
		}
	});

	t.end();
});
