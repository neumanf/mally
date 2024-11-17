package com.mally.api.shared.configuration;

import com.influxdb.client.BucketsApi;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.domain.Bucket;
import com.influxdb.client.domain.Organization;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class InfluxInitializer {
    private final InfluxDBClient influxDBClient;

    private final String bucketNames;

    private final String orgName;

    public InfluxInitializer(InfluxDBClient influxDBClient,
                             @Value("${influx.buckets}") String buckets,
                             @Value("${influx.org}") String org) {
        this.influxDBClient = influxDBClient;
        this.bucketNames = buckets;
        this.orgName = org;
    }

    @PostConstruct
    public void init() {
        createBucketsIfNotExists();
    }

    private void createBucketsIfNotExists() {
        BucketsApi bucketsApi = influxDBClient.getBucketsApi();

        Organization organization = influxDBClient.getOrganizationsApi()
                .findOrganizations().stream()
                .filter(org -> org.getName().equals(orgName))
                .findFirst()
                .orElseThrow();

        for (String bucketName : bucketNames.split(",")) {
            boolean bucketAlreadyCreated = bucketsApi.findBucketByName(bucketName) != null;

            if (bucketAlreadyCreated) {
                log.info("Bucket with name {} already created, skipping...", bucketName);
                continue;
            }

            Bucket bucket = new Bucket();
            bucket.setName(bucketName);
            bucket.setOrgID(organization.getId());

            bucketsApi.createBucket(bucket);
            log.info("Created bucket {}", bucketName);
        }
    }
}
