# tidewatch

[![CI](https://img.shields.io/github/actions/workflow/status/acme/tidewatch/ci.yml)](https://github.com/acme/tidewatch/actions) [![PyPI](https://img.shields.io/pypi/v/tidewatch)](https://pypi.org/project/tidewatch/) [![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Check tide times for any coastal station from your terminal, with optional alerts before high water. Built for sailors, surfers, and anglers who want predictions without opening a browser.

![tidewatch showing today's tides for Monterey](docs/screenshot.png)

## Install

Requires Python 3.10 or newer.

```bash
pip install tidewatch
```

## Usage

Find a station, then query it:

```bash
tidewatch search "Monterey"
tidewatch today --station 9413450
```

Example output:

```text
Monterey, CA (9413450)  high 05:42 5.1 ft   low 12:03 0.4 ft
```

## Configuration

| Flag      | Default | Description               |
|-----------|---------|---------------------------|
| --station | none    | Station ID to query       |
| --units   | ft      | `ft` or `m`               |
| --alert   | off     | Notify N minutes before high water |

Settings can also be stored in `~/.config/tidewatch/config.toml`.

## Data source

Tide predictions come from a public tide API. Results are predictions, not measurements, and should not be used for navigation safety decisions.

## Contributing

Issues and pull requests are welcome. Run the test suite with `pytest` before opening a PR, and see [CONTRIBUTING.md](CONTRIBUTING.md) for the style guide.

## License

MIT. See [LICENSE](LICENSE).
