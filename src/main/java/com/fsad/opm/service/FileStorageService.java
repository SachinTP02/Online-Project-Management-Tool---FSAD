package com.fsad.opm.service;

import com.fsad.opm.model.FileMetadata;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileStorageService {
    FileMetadata storeFile(MultipartFile file, String uploadedByUsername) throws IOException;
    FileMetadata getFile(Long id);
    byte[] getFileContent(FileMetadata metadata) throws IOException;
    List<FileMetadata> getAllFiles();
}
