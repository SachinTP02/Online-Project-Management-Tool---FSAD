package com.fsad.opm.controller;

import com.fsad.opm.dto.MilestoneRequest;
import com.fsad.opm.model.Milestone;
import com.fsad.opm.service.MilestoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milestones")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;

    @PostMapping
    public Milestone createMilestone(@RequestBody MilestoneRequest request) {
        return milestoneService.createMilestone(request);
    }

    @GetMapping
    public List<Milestone> getAllMilestones() {
        return milestoneService.getAllMilestones();
    }
}
