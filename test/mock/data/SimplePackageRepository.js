'use strict';

exports.data =
  [
    {
      name: 'bar',
      tags: {
        'latest': '1.0.0'
      },
      versions: ['1.0.0', '1.2.0'],
      packageVersions: {
        '1.0.0': {},
        '1.2.0': {
          dependencies: {
            'baz': '1.0.0'
          }
        }
      }
    },
    {
      name: 'baz',
      tags: {
        'latest': '1.0.0'
      },
      versions: ['1.0.0', '1.2.0'],
      packageVersions: {
        '1.0.0': {}
      }
    }
  ];
