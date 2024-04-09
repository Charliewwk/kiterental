package com.example.backend.config;


import com.example.backend.entity.Rent;
import com.example.backend.dto.RentRequestDTO;
import com.example.backend.dto.RentResponseDTO;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
        modelMapper.getConfiguration().setSkipNullEnabled(true);

        // Mapping from RentRequestDTO to Rent
        modelMapper.createTypeMap(RentRequestDTO.class, Rent.class)
                .addMappings(mapping -> mapping.skip(Rent::setId));

        // Mapping from Rent to RentResponseDTO
        modelMapper.createTypeMap(Rent.class, RentResponseDTO.class)
                .addMapping(src -> src.getUser().getId(), RentResponseDTO::setUserId)
                .addMapping(src -> src.getProduct().getId(), RentResponseDTO::setProductId);

        return modelMapper;
    }

}

