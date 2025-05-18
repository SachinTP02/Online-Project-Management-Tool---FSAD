package com.fsad.opm.service.impl;

import com.fsad.opm.dto.MilestoneRequest;
import com.fsad.opm.model.Milestone;
import com.fsad.opm.repository.MilestoneRepository;
import com.fsad.opm.service.MilestoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MilestoneServiceImpl implements MilestoneService {

    private final MilestoneRepository milestoneRepository;

    @Override
    public Milestone createMilestone(MilestoneRequest request) {
        Milestone milestone = Milestone.builder()
                .name(request.getName())
                .targetDate(request.getTargetDate())
                .build();
        return milestoneRepository.save(milestone);
    }

    @Override
    public List<Milestone> getAllMilestones() {
        return milestoneRepository.findAll();
    }
}
