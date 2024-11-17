package com.mally.api.shared.repositories;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.query.FluxRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class InfluxRepository {

    private final String org;

    private final InfluxDBClient influxDBClient;

    InfluxRepository(InfluxDBClient influxDBClient, @Value("${influx.org}") String org) {
        this.influxDBClient = influxDBClient;
        this.org = org;
    }

    public List<FluxRecord> query(String query) {
        var queryApi = influxDBClient.getQueryApi();

        var tables = queryApi.query(query);

        var results = new ArrayList<FluxRecord>();

        for (var table : tables) {
            var records = table.getRecords();

            results.addAll(records);
        }

        return results;
    }

    public void writeMeasurement(Object measurement, String bucket) {
        influxDBClient.getWriteApiBlocking().writeMeasurement(bucket, org, WritePrecision.MS, measurement);
    }
}
