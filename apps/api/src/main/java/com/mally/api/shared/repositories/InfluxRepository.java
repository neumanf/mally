package com.mally.api.shared.repositories;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.write.Point;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

@Repository
public class InfluxRepository {

    @Value("${influx.org}")
    private String org;

    private final InfluxDBClient influxDBClient;

    InfluxRepository(InfluxDBClient influxDBClient, @Value("${influx.org}") String org) {
        this.influxDBClient = influxDBClient;
        this.org = org;
    }

    public void writePoint(Point point, String bucket) {
        influxDBClient.getWriteApiBlocking().writePoint(bucket, org, point);
    }
}
