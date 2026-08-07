package Naresh.employee_management.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtProperties jwtProperties;

    public String generateToken(String username){
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtProperties.getExpiration()))

                .signWith(getSigningKey())

                .compact();
    }

    /**
     * Extract Username (Email)
     */
    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    /**
     * Generic Claim Extractor
     */
    public <T> T extractClaim(
            String token,
            Function<Claims, T> resolver) {

        Claims claims = extractAllClaims(token);

        return resolver.apply(claims);
    }

    /**
     * Read All Claims
     */
    private Claims extractAllClaims(String token) {

        return Jwts.parser()

                .verifyWith(getSigningKey())

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }

    /**
     * Check Expiry
     */
    public boolean isTokenExpired(String token) {

        return extractClaim(
                token,
                Claims::getExpiration
        ).before(new Date());

    }

    /**
     * Validate Token
     */
    public boolean isTokenValid(
            String token,
            String username) {

        String extractedUsername =
                extractUsername(token);

        return extractedUsername.equals(username)
                && !isTokenExpired(token);

    }

    /**
     * Secret Key
     */
    private SecretKey getSigningKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(
                        jwtProperties.getSecret());

        return Keys.hmacShaKeyFor(keyBytes);
    }
}
