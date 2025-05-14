package com.fsad.opm.service;

import com.fsad.opm.dto.MilestoneRequest;
import com.fsad.opm.model.Milestone;

import java.util.List;

public interface MilestoneService {
    Milestone createMilestone(MilestoneRequest request);
    List<Milestone> getAllMilestones();
}
