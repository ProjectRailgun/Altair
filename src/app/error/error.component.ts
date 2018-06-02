import { Component, OnInit, OnDestroy } from '@angular/core';
// import {BaseError} from '../../helpers/error';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';


@Component({
    selector: 'error-page',
    templateUrl: './error.html',
    styleUrls: ['./error.less']
})
export class ErrorComponent implements OnInit, OnDestroy {

    errorMessage: string;

    errorStatus: string;

    private routeParamsSubscription: Subscription;

    constructor(titleService: Title, private route: ActivatedRoute) {
        titleService.setTitle(`Oops! - ${SITE_TITLE}`);
    }

    ngOnInit(): any {
        this.routeParamsSubscription = this.route.params.subscribe(
            (params) => {
                this.errorMessage = params['message'];
                this.errorStatus = params['status'];
            }
        );
        return null;
    }

    ngAfterViewChecked(): any {
        // CFDG core functions (direct draws version)
        'use strict';
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        let width, height, scale, offsetX, offsetY, minSize;
        const transforms = {
            x(m, v) {
                m[4] += v * m[0];
                m[5] += v * m[1];
            },
            y(m, v) {
                m[4] += v * m[2];
                m[5] += v * m[3];
            },
            s(m, v) {
                m[0] *= v[0];
                m[1] *= v[0];
                m[2] *= v[1];
                m[3] *= v[1];
            },
            r(m, v) {
                const rad = Math.PI * v / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                const r00 = cos * m[0] + sin * m[2];
                const r01 = cos * m[1] + sin * m[3];
                m[2] = cos * m[2] - sin * m[0];
                m[3] = cos * m[3] - sin * m[1];
                m[0] = r00;
                m[1] = r01;
            },
            f(m, v) {
                const rad = Math.PI * v / 180;
                const x = Math.cos(rad);
                const y = Math.sin(rad);
                const n = 1 / (x * x + y * y);
                const b00 = (x * x - y * y) / n;
                const b01 = 2 * x * y / n;
                const b10 = 2 * x * y / n;
                const b11 = (y * y - x * x) / n;
                const r00 = b00 * m[0] + b01 * m[2];
                const r01 = b00 * m[1] + b01 * m[3];
                m[2] = b10 * m[0] + b11 * m[2];
                m[3] = b10 * m[1] + b11 * m[3];
                m[0] = r00;
                m[1] = r01;
            },
            hue(m, v) {
                m[6] += v;
                m[6] %= 360;
            },
            sat(m, v) {
                this.col(m, v, 7);
            },
            b(m, v) {
                this.col(m, v, 8);
            },
            a(m, v) {
                this.col(m, v, 9);
            },
            col(m, v, p) {
                if (v > 0) {
                    m[p] += v * (1 - m[p]);
                } else {
                    m[p] += v * m[p];
                }
            }
        };
        const copy = s => {
            return [
                s[0], // a00
                s[1], // a10
                s[2], // a01
                s[3], // a11
                s[4], // tx
                s[5], // ty
                s[6], // hue
                s[7], // saturation
                s[8], // brillance
                s[9]  // alpha
            ];
        };
        const transform = (s, p) => {
            let m = copy(s);
            for (const c in p) {
                transforms[c](m, p[c]);
            }
            return m;
        };
        const randint = (s, e = 0) => {
            if (e === 0) {
                e = s;
                s = 0;
            }
            return 1 + Math.floor(s + Math.random() * (e - s));
        };
        const loop = (n, s, t, f) => {
            let ls = copy(s);
            for (let i = 0; i < n; i++) {
                f(ls, i);
                ls = transform(ls, t);
            }
        };
        const setTransform = s => {
            ctx.setTransform(
                -scale * s[0],
                scale * s[1],
                scale * s[2],
                -scale * s[3],
                scale * s[4] + offsetX,
                -scale * s[5] + offsetY
            );
        };
        const tooSmall = s => {
            const x = (s[0] * s[0] + s[1] * s[1]) * scale;
            const y = (s[2] * s[2] + s[3] * s[3]) * scale;
            return (x < minSize && y < minSize);
        };
        const hsla = s => {
            return `hsla(${Math.round(s[6])},${Math.round(s[7] * 100)}%,${Math.round(
                s[8] * 100
            )}%,${s[9]})`;
        };
        const SQUARE = (s, t) => {
            s = transform(s, t);
            setTransform(s);
            ctx.fillStyle = hsla(s);
            ctx.fillRect(-0.5, -0.5, 1, 1);
        };
        const CIRCLE = (s, t) => {
            s = transform(s, t);
            setTransform(s);
            ctx.fillStyle = hsla(s);
            ctx.beginPath();
            ctx.arc(0, 0, 0.5, 0, 2 * Math.PI);
            ctx.fill();
        };
        const INIT = (background, s, x, y, m) => {
            width = canvas.width = canvas.offsetWidth * 2;
            height = canvas.height = canvas.offsetHeight * 2;
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, width, height);
            const r = Math.max(width, height) / 2048;
            scale = s * r;
            offsetX = x * (width / 2048);
            offsetY = y * (height / 2048);
            minSize = m;
        };
        ['click', 'touchdown'].forEach(event => {
            document.addEventListener(event, e => START(), false);
        });
        //////////////////////////////////////////////////////////////////
        // Adapted from a CFDG program
        // https://www.contextfreeart.org/gallery2/index.html#design/2370
        // City of Horrors by zch, June 21st, 2010
        //////////////////////////////////////////////////////////////////
        const START = () => {
            INIT('#fffdfc', 18, 1024, 800, 1);
            Scene([1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
        };
        const Scene = s => {
            LAYERS(s, { b: 0.9 });
        };
        const LAYERS = (s, t) => {
            s = transform(s, t);
            loop(10, s, { b: -0.2, y: -4, s: [1.2, 1.2] }, s => {
                LAYER(s, { s: [3, 3], y: 2 });
            });
        };
        const LAYER = (s, t) => {
            s = transform(s, t);
            loop(36, s, { x: 1 }, s => {
                LAYERBLOCK(s, { x: -17.5 });
            });
            loop(35, s, { x: 1 }, s => {
                LAYERBLOCK(s, { x: -17, y: -1 });
            });
        };
        const LAYERBLOCK = (s, t) => {
            s = transform(s, t);
            const r = Math.random() * 20.65;
            let weight = 0;
            switch (true) {
                case r <= (weight += 0.15):
                    SQUARE(s, { s: [1.5, 3] });
                    MONSTER(s, { y: 1.5, s: [0.1, 0.1] });
                    break;
                case r <= (weight += 0.5):
                    LAYERBLOCK(s, { s: [1.2, 1.2] });
                    break;
                case r <= (weight += 1):
                    SQUARE(s, { s: [1.5, 3] });
                    if (Math.random() > 0.6) {
                        loop(5, s, null, (s, i) => {
                            s = transform(s, { y: -0.5 + i * 0.4 });
                            loop(6, s, null, (s, i) => {
                                if (Math.random() > 0.75) {
                                    SQUARE(s, { x: -0.5 + i * 0.2, s: [0.15, 0.3], hue: 42, sat: 0.1, b: 0.1 + 0.3 * Math.random() });
                                }
                            });
                        });
                    }
                    break;
                case r <= (weight += 1):
                    LAYERBLOCK(s, { s: [0.9, 0.9] });
                    break;
                case r <= (weight += 3):
                    LAYERBLOCK(s, { y: -0.2 });
                    break;
                case r <= (weight += 3):
                    LAYERBLOCK(s, { y: 0.2 });
                    break;
                case r <= (weight += 6):
                    LAYERBLOCK(s, { r: 2 });
                    break;
                default:
                    LAYERBLOCK(s, { r: -2 });
            }
        };
        const MONSTER = (s, t) => {
            s = transform(s, t);
            loop(5, s, { r: 12 }, s => {
                TENTACLE(s, { r: -24 });
            });
        };
        const TENTACLE = (s, t) => {
            s = transform(s, t);
            const r = Math.random() * 4;
            let weight = 0;
            switch (true) {
                case r <= (weight += 1):
                    TENTACLE_TURN(s, 1);
                    break;
                case r <= (weight += 1):
                    TENTACLE_TURN(s, -1);
                    break;
                case r <= (weight += 1):
                    TENTACLE(s, { s: [0.9, 0.9] });
                    break;
                default:
                    TENTACLE(s, { s: [1.75, 1.75] });
            }
        };
        const TENTACLE_TURN = (s, d, t = {}) => {
            s = transform(s, t);
            if (tooSmall(s)) return;
            const r = Math.random() * 6;
            let weight = 0;
            switch (true) {
                case r <= (weight += 1):
                    TENTACLE_TURN(s, -1 * d);
                    break;
                default:
                    CIRCLE(s, { y: 1 });
                    SQUARE(s, { y: 0.5 });
                    CIRCLE(s, { y: 0.5, x: 0.5, s: [0.5, 0.5] });
                    TENTACLE_TURN(s, -1 * d, { y: 1, s: [0.95, 0.95], r: 12 * d, f: 90 });
            }
        };
        START();
    }

    ngOnDestroy(): any {
        if (this.routeParamsSubscription) {
            this.routeParamsSubscription.unsubscribe();
        }
        return null;
    }
}
