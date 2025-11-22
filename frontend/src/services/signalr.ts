import * as signalR from "@microsoft/signalr";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

let connection: signalR.HubConnection | null = null;

export const startSignalR = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/notifications", { 
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveNotification", (data: any) => {
      toast.success(data.message, {
        duration: 5000,
        position: "top-right",
      });
    });

  connection.start().catch(console.error);
};

export const stopSignalR = () => {
  if (connection) connection.stop();
};