exports.sayFilesChecked = (type, count) => `Checked ${count} ${type} file(s)`

exports.sayNoFiles = (type, pattern, staged) =>
    `No matching ${
        staged ? 'staged ' : ''
    }${type} files for pattern "${pattern}"`
