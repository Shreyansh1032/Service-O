import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "20s", target: 30 },
    { duration: "30s", target: 60 },
    { duration: "20s", target: 60 },
    { duration: "10s", target: 0 },
  ],
};

const SCREEN_ID = "6a538c28a6f1bbb1baef227b";

export default function () {
  http.get(`http://api-gateway:8000/api/seats/screen/${SCREEN_ID}`);
  sleep(0.1);
}