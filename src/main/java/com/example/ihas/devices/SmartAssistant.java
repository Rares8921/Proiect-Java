package com.example.ihas.devices;

import com.example.ihas.dao.SmartHubDAO;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
public final class SmartAssistant {
    private final String id;
    private final String name;
    @Setter
    private String hubId;
    @Getter
    private final List<String> eventLog;

    public SmartAssistant(String _id, String _name, String _hubId) {
        id = _id;
        name = _name;
        hubId = _hubId;
        SmartHubDAO hubDao = new SmartHubDAO();
        eventLog = new ArrayList<>();
    }

    // TODO: implementare open llm
    // Procesarea unei comenzi vocale in engleza/romana depinde cum e setata limba
    // (de ex: "Turn on the living room lights")
    public void processVoiceCommand(String command, SmartHub hub) {
        if (command.toLowerCase().contains("turn on")) {
            eventLog.add("Processed command: " + command);
            System.out.println("Voice Command: Turning on devices.");
            hub.listDevices().forEach(SmartDevice::togglePower);
        } else if (command.toLowerCase().contains("status")) {
            eventLog.add("Processed command: " + command);
            hub.listDevices().forEach(device -> System.out.println(device.getStatus()));
        } else {
            System.out.println("Command not recognized: " + command);
        }
    }

    public String getStatus() {
        return String.format("SmartAssistant[id=%s, name=%s, hubId=%s]", id, name, hubId);
    }

}

