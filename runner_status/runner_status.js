class RunnerStatus {
    static API_URL = "/demos/api/php";
    static SILKS_URL = 'https://d5r512lauia4d.cloudfront.net/';
    static DEBUG = window.location.host.match(/stg/);
    static WS_URL = `wss://stream.tpd.zone/realtime_${RunnerStatus.DEBUG ? 'ws_dev' : '1.3'}`
    static VERSION = `2024.03.19${RunnerStatus.DEBUG ? '-dev' : ''}`;

    static Type = {
        Live: 'Live',
        Historic: 'Historic'
    };

    static statuses = {
        'SD': 'Saddling',
        'PR': 'Parading',
        'GD': 'Going Down',
        'AP': 'At the Post',
        'GB': 'Going Behind',
        'LG': 'Loading',
        'LD': 'Loaded',
        'R': 'Running',
        'F': 'Finished'
    }

    static PlayerStatus = {
        RUNNING: 'running',
        STOPPED: 'stopped',
        PAUSED: 'paused',
        ERROR: 'error'
    }

    static dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'UTC'
    });
    static timeFormat = new Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'UTC'
    });
    static relativeTimeFormat = (mseconds) => `${mseconds < 0 ? '-' : ''}${new Date(Math.abs(mseconds)).toLocaleTimeString('en-GB', {
        timeZone: 'UTC',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })}`;

    currentTime = 0;
    postTime = 0;
    #actualStart = false;
    runners = [];
    curStatuses = RunnerStatus.statuses;
    sc = 0;

    $race = null;
    $time = null;
    $diff = null;
    $runners = null;
    $parent = null;
    #type = null;

    constructor(type, parent, sc) {
        this.sc = sc;
        this.#type = type;
        this.$parent = $(parent);
        this.$parent.attr('sc', sc);
        this.$race = $('<div>').addClass('race');
        this.$time = $('<span>').addClass('time').attr('title', 'Current time');
        this.$diff = $('<span>').addClass('diff');
        this.$runners = $('<table>').addClass('runners').attr('cellspacing', 0);
        this.$runners.$thead = $('<thead>');
        this.$runners.$tbody = $('<tbody>');
        this.$runners.append(this.$runners.$thead, this.$runners.$tbody);
        this.$log = RunnerStatus.DEBUG ? $('<div>').addClass('log') : null;

        this.$parent.html('').append($('<div>').attr('id', 'runner_status').append(
            this.$race,
            $('<div>').addClass('right').append(this.$time, this.$diff),
            this.$runners,
            this.$log,
        ));

    }

    async finishLoading() { }

    async log(message) {
        console.log(message.replace(/<[^>]*>?/gm, ''));
        if (RunnerStatus.DEBUG && this.$log) {
            const $it = $('<li>').append($('<span>').addClass('time').html(RunnerStatus.timeFormat.format(this.currentTime || new Date().getTime())), $('<span>').html(message));
            this.$log.append($it)
            $it.get(0).scrollIntoView();
        }
    }

    panic(message) {
        this.$parent.html('').append($('<div>').text(message).addClass('panic'));
    }

    async setRunnerStatus(r, status) {
        if (r) {
            const old = r.attr('status');
            if (old != status) {
                this.log(`${r.attr('cl')} is <b>${RunnerStatus.statuses[status]}</b>`);
                r.attr('status', status).find('.r').css('left', `${Object.keys(this.curStatuses).findIndex(s => s == status) * 100 + 50}%`);
            }
        }
    }

    async updateRaceTotals() {
        let stopped = false;
        let loaded = 0;
        this.runners.forEach(r => {
            const status = r.attr('status') ?? 'SD';
            if (status == 'F') {
                stopped = true;
            } else if (status == 'LD') {
                loaded++;
            }
        });
        this.$runners.find('th.LD').attr('done', loaded ? `${loaded} / ${this.runners.length}` : '')
        if (stopped) this.setPlayerStatus(RunnerStatus.PlayerStatus.STOPPED);
    }

    get type() { return this.#type }

    initCurrentTime() { }

    get currentTime() { return this.currentTime; }

    set currentTime(val) {
        this.currentTime = val;
        this.$time.text(RunnerStatus.timeFormat.format(this.currentTime));
        this.$diff
            .text(RunnerStatus.relativeTimeFormat((this.actualStart && this.actualStart <= this.currentTime
                ? this.currentTime - this.actualStart
                : this.postTime - this.currentTime)))
            .toggleClass('inplay', !!(this.actualStart && this.actualStart <= this.currentTime));
    }

    get actualStart() { return this.#actualStart }
    set actualStart(val) {
        this.#actualStart = val;
    }

    async populateRunners(data) {
        this.log(`Loading <b>${data.sc}</b>. Got <b>${Object.keys(data.runners).length}</b> runners. Post time: <b>${RunnerStatus.dateTimeFormat.format(new Date(data.post_time))}</b>`)
        this.$race.html('').append([
            $('<span>').addClass(`fi fi-${data.country.toLowerCase()}`),
            $('<span>').text(RunnerStatus.racecourses[data.racecourse] ?? data.racecourse),
            $('<span>').text(RunnerStatus.dateTimeFormat.format(new Date(`${data.post_time}+0`))),
            $('<span>').text(data.distance.replace(/^|\s0\w\s*/g, '')).attr('title', 'Race distance'),
            $('<span>').text(data.obstacle)
        ]).show();
        this.$time.parent().show();

        this.postTime = (new Date(`${data.post_time}+0`)).getTime();
        this.actualStart = data.gmax * 1000;
        this.initCurrentTime();

        this.curStatuses = data.obstacle == 'flat' ? RunnerStatus.statuses : Object.fromEntries(Object.entries(RunnerStatus.statuses).filter(([s, sn]) => !['LD', 'LG'].includes(s)));
        this.runners = Object.entries(data.runners).map(([cl, r]) => {
            return $('<tr>')
                .attr('cl', cl)
                .attr('stall', r.stall_draw)
                .data('status', r.status)
                .addClass('runner')
                .append([
                    $('<td>').addClass('stall').text(r.stall_draw),
                    $('<td>').addClass('cl').text(cl),
                    $('<td>').addClass('name').text(r.name),
                    ...Object.entries(this.curStatuses).map(([s, sn]) => $('<td>').addClass('status').addClass(s).text(this.runnerFirstStatusTime(r.status, s))),
                ])
        });
        this.runners.map(r => r.find('.status.SD').append($('<img>').attr('cl', r.attr('cl')).addClass('silk').addClass('r').attr('src', `${RunnerStatus.SILKS_URL}${data.sc}${r.attr('cl')}.jpg`)));
        this.$runners.$thead.html('').append([
            $('<th>').addClass('stall').text('SD').attr('title', 'Stall Draw').on('click', () => this.sortRunners('stall')),
            $('<th>').addClass('cl').text('CL').attr('title', 'Cloth Number').on('click', () => this.sortRunners('cl')),
            $('<th>').text('Name'),
            ...Object.entries(this.curStatuses).map(([s, sn]) => $('<th>').addClass('status').addClass(s).attr('title_long', sn).attr('title_short', s)),
        ]);
        this.$runners.$tbody.html('').append(this.runners);
        this.$runners.$tbody.find('img').on('error', function () {
            const self = $(this);
            const cl = self.attr('cl');
            const parent = self.parent();
            self.remove()
            parent.append($('<div>').addClass('silks').addClass('r').addClass(`silks_${+cl}`).text(cl));
        })
        this.sortRunners('cl')
    }

    runnerFirstStatusTime(rr, s) {
        return '';
    }

    sortRunners(f) {
        this.$runners.$tbody.append(this.runners.sort((a, b) => +a.attr(f) - b.attr(f)));
        this.$runners.$thead.find('th').removeClass('sorted');
        this.$runners.$thead.find(`th.${f}`).addClass('sorted');
    }





    static racecourses = {};
    static async getRececourses() {
        const response = await fetch(`${RunnerStatus.API_URL}/runner_status.php`);
        if (response.status == 200) {
            const data = await response.json();
            if (data?.courses) {
                RunnerStatus.racecourses = Object.fromEntries(data.courses.map(i => [i.code, i.full_name]));
            }
        }
    }

    static panic(parent, message) {
        $(parent).html('').append($('<div>').text(message).addClass('panic'));
        console.error(message);
    }

    static async create(parent, sc) {
        $(parent).removeClass('panic').html('Loading...');
        const response = await fetch(`${RunnerStatus.API_URL}/runner_status.php?sc=${sc}`);
        $(parent).html('');
        if (response.status == 200) {
            const data = await response.json();
            if (data?.data) {
                const ret = data.data.live ? new RunnerStatusLive(parent, sc) : new RunnerStatusHistoric(parent, sc);
                await ret.populateRunners(data.data);
                await ret.finishLoading();
                return ret;
            } else {
                RunnerStatus.panic(parent, 'Race not found');
            }
        } else {
            RunnerStatus.panic(parent, 'Server error');
        }
    }
}






class RunnerStatusLive extends RunnerStatus {
    $connected = null;
    #interval = null;
    #clientKey = null;

    static ConnectionStatus = {
        Offline: 'offline',
        Online: 'online',
        Connecting: 'connecting',
        Error: 'error'
    }
    #connectionStatus = RunnerStatusLive.ConnectionStatus.Offline;
    ws = null;

    async getAccessKey() {
        this.log('Getting srteam access key...')
        const response = await fetch(`${RunnerStatus.API_URL}/streaming_request.php?sc=${this.sc}&mode=live`);
        if (response.status == 200) {
            data = await response.json();
            if (data?.clientKey && data?.runners) {
                this.#clientKey = data.clientKey;
                return this.connect(data);
            }
        }
        this.panic('Unable to obtain stream session');
    }

    get connectionStatus() {
        return this.#connectionStatus;
    }

    set connectionStatus(val) {
        this.log(`Connection is <b>${val}</b>`)
        this.#connectionStatus = val;
        this.$connected.trigger('update')
    }

    panic(message) {
        window.clearInterval(this.#interval);
        this.disconnect();
        super.panic(message);
    }

    async disconnect() {
        this.ws?.close();
        this.ws = null;
    }

    async reconnect() {
        if (this.sc == this.$parent.attr('sc')) {
            this.log('Reconnecting...')
            await this.disconnect()
            window.setTimeout(() => { this.connect() }, 2000)
        }
    }

    async connect() {
        this.connectionStatus = RunnerStatusLive.ConnectionStatus.Connecting;
        await this.disconnect();
        this.ws = new WebSocket(RunnerStatus.WS_URL);
        this.ws.addEventListener('error', (event) => { // attempt reconnection
            this.connectionStatus = RunnerStatusLive.ConnectionStatus.Error;
            this.log("Socket Error", JSON.stringify(event));
            this.reconnect();
        });
        this.ws.addEventListener('close', (event) => {
            this.connectionStatus = RunnerStatusLive.ConnectionStatus.Offline;
            this.log("Socket Closed " + JSON.stringify(event) + JSON.stringify(event?.reason));
            if (!event?.reason) {
                this.reconnect();
            }
        })
        this.ws.addEventListener('open', (event) => {
            this.connectionStatus = RunnerStatusLive.ConnectionStatus.Online;
        });
        this.ws.addEventListener('message', (event) => {
            try {
                const message = JSON.parse(event.data)
                if (message?.status) {
                    if (message.status == "connected") {
                        if (message.id && this.#clientKey) {
                            if (message.open_markets?.includes(this.sc)) {
                                this.ws.send(
                                    JSON.stringify({
                                        vendorKey: this.#clientKey, // client is the temporary vendor
                                        clientKey: this.#clientKey,
                                        sc: [this.sc],
                                        inc: ['RS'], // will be ignored and set to ['RS'] on server side for security reason
                                    })
                                )
                            } else {
                                this.panic('The race is not found on live stream');
                            }
                        } else {
                            this.panic('Internal steam server error');
                        }
                    }
                } else if (message.SC == this.sc) {
                    if (message.RS) {
                        Object.entries(message.RS).forEach(([cl, s]) => {
                            this.setRunnerStatus(this.runners.find(r => r.attr('cl') == cl), s)
                        });
                    }
                    if (!this.actualStart && message.MR === true) {
                        this.actualStart = new Date(message.T).getTime();
                    }
                    if (this.actualStart && message.MR === false) {
                        this.actualStart = false;
                    }

                }
                this.$connected.trigger('update');

            } catch (error) {
                this.log(error)
            }
        });
    }


    constructor(parent, sc) {
        super(RunnerStatus.Type.Live, parent, sc);
        this.$connected = $('<span>').addClass('connected')
            .on("click", () => {
                if (this.connectionStatus != RunnerStatusLive.ConnectionStatus.Online) {
                    this.connect();
                }
            }).on('update', () => {
                this.$connected
                    .removeClass('offline online connecting error')
                    .addClass(this.connectionStatus)
                    .addClass('ping')
                    .attr('title', `Stream status: ${this.connectionStatus.toUpperCase()}. Last update at ${RunnerStatus.timeFormat.format(new Date())}`)
            });
        this.$time.parent().append(this.$diff, this.$connected);
        this.connectionStatus = RunnerStatusLive.ConnectionStatus.Offline;
        this.#interval = window.setInterval(() => {
            if (this.sc != this.$parent.attr('sc')) {
                window.clearInterval(this.#interval);
                this.disconnect();
                return;
            }
            super.currentTime = new Date().getTime();
            this.$connected
                .removeClass('ping')
        }, 1000);

    }

    initCurrentTime() {
        super.currentTime = new Date().getTime();
    }

    async finishLoading() {
        this.getAccessKey();
    }
}

class RunnerStatusHistoric extends RunnerStatus {
    stp = 300;
    speed = 10;
    interval = false;
    $control = null;

    constructor(parent, sc) {
        super(RunnerStatus.Type.Historic, parent, sc);
        this.$control = $('<span>').addClass('control')
            .on("click", () => {
                this.setPlayerStatus(this.playerStatus == RunnerStatus.PlayerStatus.RUNNING ? RunnerStatus.PlayerStatus.PAUSED : RunnerStatus.PlayerStatus.RUNNING);
            });
        this.$time.parent().append(this.$control);
        this.setSpeed(10);
    }

    initCurrentTime() {
        super.currentTime = this.postTime - this.stp * 1000;
    }

    async finishLoading() {
        this.setPlayerStatus(RunnerStatus.PlayerStatus.STOPPED);
    }

    async updateAnimation() {
        if (this.playerStatus == RunnerStatus.PlayerStatus.RUNNING) {
            super.currentTime += 1000;
            this.$time?.text(RunnerStatus.timeFormat.format(this.currentTime));
            this.runners.forEach(r => {
                const status = r.data('status')?.filter(c => c.t * 1000 <= super.currentTime).pop();
                if (status) {
                    this.setRunnerStatus(r, status.s);
                }
            })
            this.updateRaceTotals();
        }
    }


    setSpeed(speed) {
        this.log(`Set speed to <b>${speed}</b>`)
        this.speed = speed;
        if (this.interval)
            window.clearInterval(this.interval);
        this.interval = window.setInterval(this.updateAnimation.bind(this), 1000 / this.speed);
    }

    runnerFirstStatusTime(rr, s) {
        const t = rr.find(i => i.s == s)?.t;
        return t ? RunnerStatus.timeFormat.format(new Date(t * 1000)) : '';
    }

    async setPlayerStatus(status) {
        switch (status) {
            case RunnerStatus.PlayerStatus.PAUSED:
            case RunnerStatus.PlayerStatus.STOPPED:
                this.$control.removeClass('running').addClass('paused').attr('title', 'Play');
                break;
            case RunnerStatus.PlayerStatus.RUNNING:
                if (this.playerStatus === RunnerStatus.PlayerStatus.STOPPED) {
                    this.currentTime = this.postTime - this.stp * 1000;
                }
                this.$control.removeClass('paused').addClass('running').attr('title', 'Pause');
                break;
        }
        this.log(`Player is <b>${status}</b>`)
        this.playerStatus = status;
        if ($.isFunction(this.onStatusChange)) this.onStatusChange(status);
    }

}

RunnerStatus.getRececourses();
