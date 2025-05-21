package com.fsad.opm.service.impl;

import com.fsad.opm.model.FileMetadata;
import com.fsad.opm.model.User;
import com.fsad.opm.repository.FileMetadataRepository;
import com.fsad.opm.repository.UserRepository;
import com.fsad.opm.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final FileMetadataRepository fileRepo;
    private final UserRepository userRepo;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public FileMetadata storeFile(MultipartFile file, String uploadedByUsername) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        String filePath = uploadPath.resolve(file.getOriginalFilename()).toString();
        file.transferTo(new File(filePath));

        User user = userRepo.findByUsername(uploadedByUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FileMetadata metadata = FileMetadata.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .filePath(filePath)
                .uploadedBy(user)
                .build();

        return fileRepo.save(metadata);
    }

    @Override
    public FileMetadata getFile(Long id) {
        return fileRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    @Override
    public byte[] getFileContent(FileMetadata metadata) throws IOException {
        return Files.readAllBytes(Paths.get(metadata.getFilePath()));
    }

    @Override
    public List<FileMetadata> getAllFiles() {
        return fileRepo.findAll();
    }
}
