#!/bin/bash

# oradbpm login
oradbpm publish --oradbpm-dir=sqlsn-core
oradbpm publish --oradbpm-dir=sqlsn-stack
oradbpm publish --oradbpm-dir=sqlsn-run
oradbpm publish --oradbpm-dir=sqlsn
oradbpm publish --oradbpm-dir=pete

