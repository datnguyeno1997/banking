package com.cg.repository;

import com.cg.model.LocationRegion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ILocationRegionRepository extends JpaRepository<LocationRegion, Long> {
}
