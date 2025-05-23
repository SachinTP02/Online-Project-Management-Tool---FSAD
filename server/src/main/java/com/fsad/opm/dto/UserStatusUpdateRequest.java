package com.fsad.opm.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserStatusUpdateRequest {
    private String status;
    private String username;


}
