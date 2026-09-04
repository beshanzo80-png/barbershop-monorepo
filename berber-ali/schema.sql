-- Berber Ali - MySQL Veritabanı Şeması
-- Karakter seti ve collation ayarları
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================
-- TABLO: users (Kullanıcılar - Müşteri & Berber & Admin)
-- =============================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL COMMENT 'Public ID for APIs',
    `role` ENUM('customer','barber','admin') NOT NULL DEFAULT 'customer',
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL COMMENT 'E.164 format: +905xxxxxxxxx',
    `email` VARCHAR(191) DEFAULT NULL,
    `password_hash` VARCHAR(255) NOT NULL COMMENT 'password_hash() output',
    `avatar_url` VARCHAR(500) DEFAULT NULL,
    `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `last_login_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_uuid` (`uuid`),
    UNIQUE KEY `uk_users_phone` (`phone`),
    UNIQUE KEY `uk_users_email` (`email`),
    KEY `idx_users_role` (`role`),
    KEY `idx_users_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sistem kullanıcıları';

-- =============================================
-- TABLO: barbers (Berber Profilleri)
-- =============================================
DROP TABLE IF EXISTS `barbers`;
CREATE TABLE `barbers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `bio` TEXT DEFAULT NULL,
    `experience_years` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `specialties` JSON DEFAULT NULL COMMENT '["fade", "classic", "beard", "color"]',
    `rating` DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    `review_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `commission_rate` DECIMAL(4,2) NOT NULL DEFAULT 40.00 COMMENT 'Yüzde %',
    `hire_date` DATE DEFAULT NULL,
    `is_available` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_barbers_user` (`user_id`),
    KEY `idx_barbers_available` (`is_available`),
    KEY `idx_barbers_rating` (`rating`),
    CONSTRAINT `fk_barbers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Berber profilleri';

-- =============================================
-- TABLO: barber_schedules (Berber Çalışma Saatleri)
-- =============================================
DROP TABLE IF EXISTS `barber_schedules`;
CREATE TABLE `barber_schedules` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `barber_id` BIGINT UNSIGNED NOT NULL,
    `day_of_week` TINYINT UNSIGNED NOT NULL COMMENT '0=Pazar, 1=Pazartesi...6=Cumartesi',
    `start_time` TIME NOT NULL COMMENT 'Örn: 09:00:00',
    `end_time` TIME NOT NULL COMMENT 'Örn: 19:00:00',
    `break_start` TIME DEFAULT NULL COMMENT 'Mola başlangıcı',
    `break_end` TIME DEFAULT NULL COMMENT 'Mola bitişi',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_barber_schedule` (`barber_id`, `day_of_week`),
    KEY `idx_barber_schedules_active` (`is_active`),
    CONSTRAINT `fk_schedules_barber` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `chk_day_of_week` CHECK (`day_of_week` BETWEEN 0 AND 6),
    CONSTRAINT `chk_time_order` CHECK (`start_time` < `end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Berber haftalık çalışma programı';

-- =============================================
-- TABLO: chairs (Koltuklar)
-- =============================================
DROP TABLE IF EXISTS `chairs`;
CREATE TABLE `chairs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `number` TINYINT UNSIGNED NOT NULL,
    `name` VARCHAR(50) DEFAULT NULL COMMENT 'Örn: VIP Koltuk, Standart 1',
    `barber_id` BIGINT UNSIGNED DEFAULT NULL COMMENT 'NULL = herkes kullanabilir',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_chairs_number` (`number`),
    KEY `idx_chairs_barber` (`barber_id`),
    KEY `idx_chairs_active` (`is_active`),
    CONSTRAINT `fk_chairs_barber` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Koltuklar';

-- =============================================
-- TABLO: services (Hizmetler)
-- =============================================
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `duration_minutes` SMALLINT UNSIGNED NOT NULL COMMENT 'Dakika cinsinden',
    `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `category` ENUM('haircut','beard','coloring','treatment','package','kids') NOT NULL DEFAULT 'haircut',
    `image_url` VARCHAR(500) DEFAULT NULL,
    `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_services_uuid` (`uuid`),
    KEY `idx_services_category` (`category`),
    KEY `idx_services_active` (`is_active`),
    KEY `idx_services_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hizmetler';

-- =============================================
-- TABLO: barber_services (Berber - Hizmet İlişkisi + Özel Fiyat)
-- =============================================
DROP TABLE IF EXISTS `barber_services`;
CREATE TABLE `barber_services` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `barber_id` BIGINT UNSIGNED NOT NULL,
    `service_id` BIGINT UNSIGNED NOT NULL,
    `custom_price` DECIMAL(10,2) DEFAULT NULL COMMENT 'NULL = varsayılan fiyat',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_barber_service` (`barber_id`, `service_id`),
    KEY `idx_barber_services_barber` (`barber_id`),
    KEY `idx_barber_services_service` (`service_id`),
    CONSTRAINT `fk_bs_barber` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_bs_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Berber hizmet yetkileri ve özel fiyatlar';

-- =============================================
-- TABLO: appointments (Randevular)
-- =============================================
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `barber_id` BIGINT UNSIGNED NOT NULL,
    `chair_id` BIGINT UNSIGNED DEFAULT NULL,
    `status` ENUM('pending','confirmed','in_progress','completed','cancelled','no_show','rescheduled') NOT NULL DEFAULT 'pending',
    `start_at` DATETIME NOT NULL COMMENT 'Randevu başlangıç (UTC)',
    `end_at` DATETIME NOT NULL COMMENT 'Randevu bitiş (UTC)',
    `total_duration` SMALLINT UNSIGNED NOT NULL COMMENT 'Toplam dakika',
    `total_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `final_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `payment_status` ENUM('pending','paid','partial','refunded','failed') NOT NULL DEFAULT 'pending',
    `payment_method` ENUM('cash','card','online','loyalty','mixed') DEFAULT NULL,
    `payment_ref` VARCHAR(100) DEFAULT NULL COMMENT 'İyzico/PayTR transaction ID',
    `notes` TEXT DEFAULT NULL COMMENT 'Müşteri notu',
    `cancellation_reason` VARCHAR(255) DEFAULT NULL,
    `cancelled_by` ENUM('customer','barber','admin') DEFAULT NULL,
    `cancelled_at` TIMESTAMP NULL DEFAULT NULL,
    `reminder_24h_sent` TINYINT(1) NOT NULL DEFAULT 0,
    `reminder_2h_sent` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_appointments_uuid` (`uuid`),
    KEY `idx_appointments_customer` (`customer_id`),
    KEY `idx_appointments_barber` (`barber_id`),
    KEY `idx_appointments_chair` (`chair_id`),
    KEY `idx_appointments_status` (`status`),
    KEY `idx_appointments_start` (`start_at`),
    KEY `idx_appointments_barber_start` (`barber_id`, `start_at`),
    KEY `idx_appointments_chair_start` (`chair_id`, `start_at`),
    CONSTRAINT `fk_appointments_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_appointments_barber` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_appointments_chair` FOREIGN KEY (`chair_id`) REFERENCES `chairs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `chk_time_order_appt` CHECK (`start_at` < `end_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Randevular';

-- =============================================
-- TABLO: appointment_services (Randevu - Hizmet Detayları)
-- =============================================
DROP TABLE IF EXISTS `appointment_services`;
CREATE TABLE `appointment_services` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `appointment_id` BIGINT UNSIGNED NOT NULL,
    `service_id` BIGINT UNSIGNED NOT NULL,
    `price` DECIMAL(10,2) NOT NULL COMMENT 'Anlık fiyat kopyası',
    `duration_minutes` SMALLINT UNSIGNED NOT NULL,
    `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_appt_services_appt` (`appointment_id`),
    KEY `idx_appt_services_service` (`service_id`),
    CONSTRAINT `fk_as_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_as_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Randevu hizmet detayları';

-- =============================================
-- TABLO: notifications (Bildirimler)
-- =============================================
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `type` ENUM('appointment_confirmed','appointment_reminder_24h','appointment_reminder_2h','appointment_cancelled','appointment_rescheduled','review_request','promotion','system') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `data` JSON DEFAULT NULL COMMENT '{"appointment_id": 123, "action_url": "/appointments/123"}',
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `read_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_notifications_user` (`user_id`),
    KEY `idx_notifications_read` (`is_read`),
    KEY `idx_notifications_created` (`created_at`),
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Kullanıcı bildirimleri';

-- =============================================
-- TABLO: reviews (Değerlendirmeler)
-- =============================================
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `appointment_id` BIGINT UNSIGNED NOT NULL,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `barber_id` BIGINT UNSIGNED NOT NULL,
    `rating` TINYINT UNSIGNED NOT NULL COMMENT '1-5',
    `comment` TEXT DEFAULT NULL,
    `is_anonymous` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_reviews_appointment` (`appointment_id`),
    KEY `idx_reviews_barber` (`barber_id`),
    KEY `idx_reviews_customer` (`customer_id`),
    CONSTRAINT `fk_reviews_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_reviews_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_reviews_barber` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `chk_rating` CHECK (`rating` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Berber değerlendirmeleri';

-- =============================================
-- TABLO: loyalty_transactions (Sadakat Puan İşlemleri)
-- =============================================
DROP TABLE IF EXISTS `loyalty_transactions`;
CREATE TABLE `loyalty_transactions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `appointment_id` BIGINT UNSIGNED DEFAULT NULL,
    `type` ENUM('earn','redeem','expire','adjust') NOT NULL,
    `points` INT NOT NULL COMMENT 'Pozitif = kazanım, Negatif = harcama',
    `balance_after` INT NOT NULL COMMENT 'İşlem sonrası bakiye',
    `description` VARCHAR(255) DEFAULT NULL,
    `expires_at` DATE DEFAULT NULL COMMENT 'Puan geçerlilik tarihi',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_loyalty_customer` (`customer_id`),
    KEY `idx_loyalty_appointment` (`appointment_id`),
    KEY `idx_loyalty_type` (`type`),
    CONSTRAINT `fk_loyalty_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_loyalty_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sadakat puan hareketleri';

-- =============================================
-- TABLO: settings (Sistem Ayarları)
-- =============================================
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `key_name` VARCHAR(100) NOT NULL,
    `value` JSON NOT NULL,
    `category` ENUM('general','booking','notification','payment','appearance') NOT NULL DEFAULT 'general',
    `description` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_settings_key` (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sistem ayarları';

-- =============================================
-- VIEW: v_available_slots (Müsait Saat Dilimleri - Performans için)
-- =============================================
DROP VIEW IF EXISTS `v_available_slots`;
CREATE VIEW `v_available_slots` AS
SELECT 
    b.`id` AS `barber_id`,
    b.`user_id` AS `barber_user_id`,
    u.`name` AS `barber_name`,
    u.`avatar_url` AS `barber_avatar`,
    c.`id` AS `chair_id`,
    c.`number` AS `chair_number`,
    c.`name` AS `chair_name`,
    bs.`day_of_week`,
    bs.`start_time`,
    bs.`end_time`,
    bs.`break_start`,
    bs.`break_end`
FROM `barbers` b
INNER JOIN `users` u ON u.`id` = b.`user_id` AND u.`is_active` = 1
INNER JOIN `barber_schedules` bs ON bs.`barber_id` = b.`id` AND bs.`is_active` = 1
LEFT JOIN `chairs` c ON c.`barber_id` = b.`id` AND c.`is_active` = 1
WHERE b.`is_available` = 1 AND b.`is_active` = 1;

-- =============================================
-- TRIGGER: Randevu oluşturulduğunda sadakat puanı ekle
-- =============================================
DELIMITER $$
DROP TRIGGER IF EXISTS `trg_appointment_completed_loyalty`$$
CREATE TRIGGER `trg_appointment_completed_loyalty`
AFTER UPDATE ON `appointments`
FOR EACH ROW
BEGIN
    IF NEW.`status` = 'completed' AND OLD.`status` != 'completed' THEN
        -- 100 TL = 100 puan (1 TL = 1 puan)
        SET @points_earned = FLOOR(NEW.`final_price`);
        SET @current_balance = COALESCE((
            SELECT `balance_after` FROM `loyalty_transactions` 
            WHERE `customer_id` = NEW.`customer_id` 
            ORDER BY `id` DESC LIMIT 1
        ), 0);
        
        INSERT INTO `loyalty_transactions` (`customer_id`, `appointment_id`, `type`, `points`, `balance_after`, `description`)
        VALUES (NEW.`customer_id`, NEW.`id`, 'earn', @points_earned, @current_balance + @points_earned, CONCAT('Randevu tamamlandı: ', NEW.`uuid`));
        
        -- Bildirim oluştur
        INSERT INTO `notifications` (`user_id`, `type`, `title`, `message`, `data`)
        VALUES (NEW.`customer_id`, 'promotion', 'Puan Kazandınız!', CONCAT(@points_earned, ' sadakat puanı hesabınıza eklendi.'), JSON_OBJECT('points', @points_earned));
    END IF;
END$$
DELIMITER ;

-- =============================================
-- TRIGGER: Randevu iptal edildiğinde koltuk serbest kalır
-- =============================================
DELIMITER $$
DROP TRIGGER IF EXISTS `trg_appointment_cancelled_cleanup`$$
CREATE TRIGGER `trg_appointment_cancelled_cleanup`
AFTER UPDATE ON `appointments`
FOR EACH ROW
BEGIN
    IF NEW.`status` IN ('cancelled','no_show') AND OLD.`status` NOT IN ('cancelled','no_show') THEN
        -- Bildirim: Berbere
        INSERT INTO `notifications` (`user_id`, `type`, `title`, `message`, `data`)
        SELECT b.`user_id`, 'appointment_cancelled', 'Randevu İptal Edildi', 
               CONCAT('Müşteri ', u.`name`, ' randevuyu iptal etti.'),
               JSON_OBJECT('appointment_id', NEW.`id`, 'customer_name', u.`name`)
        FROM `barbers` b
        INNER JOIN `users` u ON u.`id` = NEW.`customer_id`
        WHERE b.`id` = NEW.`barber_id`;
    END IF;
END$$
DELIMITER ;

-- =============================================
-- STORED PROCEDURE: get_available_slots
-- Seçilen tarihte berberin müsait slotlarını hesaplar
-- =============================================
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_get_available_slots`$$
CREATE PROCEDURE `sp_get_available_slots`(
    IN p_date DATE,
    IN p_barber_id BIGINT UNSIGNED,
    IN p_service_duration INT COMMENT 'Toplam hizmet süresi (dk)',
    IN p_slot_interval INT COMMENT 'Slot aralığı (dk), default 30'
)
BEGIN
    DECLARE v_day_of_week TINYINT;
    DECLARE v_start_time TIME;
    DECLARE v_end_time TIME;
    DECLARE v_break_start TIME;
    DECLARE v_break_end TIME;
    DECLARE v_current_time TIME;
    DECLARE v_slot_end TIME;
    DECLARE v_is_booked TINYINT;
    
    -- Geçici tablo oluştur
    DROP TEMPORARY TABLE IF EXISTS `tmp_slots`;
    CREATE TEMPORARY TABLE `tmp_slots` (
        `slot_start` TIME NOT NULL,
        `slot_end` TIME NOT NULL,
        `barber_id` BIGINT UNSIGNED NOT NULL,
        `chair_id` BIGINT UNSIGNED DEFAULT NULL,
        `is_available` TINYINT(1) NOT NULL DEFAULT 1,
        PRIMARY KEY (`slot_start`, `barber_id`)
    ) ENGINE=MEMORY;
    
    -- Berberin o günün programını al
    SELECT `day_of_week`, `start_time`, `end_time`, `break_start`, `break_end`
    INTO v_day_of_week, v_start_time, v_end_time, v_break_start, v_break_end
    FROM `barber_schedules`
    WHERE `barber_id` = p_barber_id 
      AND `day_of_week` = DAYOFWEEK(p_date) - 1
      AND `is_active` = 1
    LIMIT 1;
    
    IF v_start_time IS NOT NULL THEN
        SET v_current_time = v_start_time;
        
        slot_loop: WHILE v_current_time < v_end_time DO
            SET v_slot_end = ADDTIME(v_current_time, SEC_TO_TIME(p_service_duration * 60));
            
            IF v_slot_end <= v_end_time THEN
                -- Mola saati kontrolü
                SET @in_break = 0;
                IF v_break_start IS NOT NULL AND v_break_end IS NOT NULL THEN
                    IF v_current_time >= v_break_start AND v_slot_end <= v_break_end THEN
                        SET @in_break = 1;
                    ELSEIF v_current_time < v_break_end AND v_slot_end > v_break_start THEN
                        SET @in_break = 1;
                    END IF;
                END IF;
                
                IF @in_break = 0 THEN
                    -- Çakışan randevu var mı?
                    SELECT COUNT(*) INTO v_is_booked
                    FROM `appointments`
                    WHERE `barber_id` = p_barber_id
                      AND `status` IN ('pending','confirmed','in_progress')
                      AND DATE(`start_at`) = p_date
                      AND (
                          (TIME(`start_at`) < v_slot_end AND TIME(`end_at`) > v_current_time)
                      );
                    
                    INSERT INTO `tmp_slots` (`slot_start`, `slot_end`, `barber_id`, `chair_id`, `is_available`)
                    VALUES (v_current_time, v_slot_end, p_barber_id, NULL, IF(v_is_booked = 0, 1, 0));
                END IF;
            END IF;
            
            SET v_current_time = ADDTIME(v_current_time, SEC_TO_TIME(p_slot_interval * 60));
        END WHILE;
    END IF;
    
    -- Sonuçları döndür
    SELECT 
        `slot_start` AS `time`,
        TIME_FORMAT(`slot_start`, '%H:%i') AS `time_formatted`,
        `is_available` AS `available`,
        `barber_id`,
        `chair_id`
    FROM `tmp_slots`
    ORDER BY `slot_start`;
    
    DROP TEMPORARY TABLE IF EXISTS `tmp_slots`;
END$$
DELIMITER ;

-- =============================================
-- BAŞLANGIÇ VERİLERİ (Seed Data)
-- =============================================

-- Ayarlar
INSERT INTO `settings` (`key_name`, `value`, `category`, `description`) VALUES
('shop_name', '"Berber Ali"', 'general', 'Dükkan adı'),
('shop_phone', '"+905551234567"', 'general', 'Dükkan telefonu'),
('shop_address', '"İstanbul, Kadıköy, Moda Cd. No:123"', 'general', 'Dükkan adresi'),
('shop_whatsapp', '"+905551234567"', 'general', 'WhatsApp Business numarası'),
('booking_advance_days', '60', 'booking', 'Kaç gün önceden randevu alınabilir'),
('booking_min_hours', '1', 'booking', 'Minimum kaç saat öncesine kadar randevu alınabilir'),
('slot_interval_minutes', '30', 'booking', 'Randevu slot aralığı (dk)'),
('reminder_24h_enabled', 'true', 'notification', '24 saat hatırlatma aktif'),
('reminder_2h_enabled', 'true', 'notification', '2 saat hatırlatma aktif'),
('gold_color', '"#D4A843"', 'appearance', 'Marka rengi (Gold)'),
('dark_bg', '"#0D0D0D"', 'appearance', 'Koyu tema arka plan');

-- Hizmetler
INSERT INTO `services` (`uuid`, `name`, `description`, `duration_minutes`, `price`, `category`, `sort_order`) VALUES
(UUID(), 'Saç Kesimi', 'Klasik veya modern saç kesimi, şekillendirme ve fınış', 30, 150.00, 'haircut', 1),
(UUID(), 'Sakal Tıraşı', 'Geleneksel usta tıraşı, sıcak bez ile cilt bakımı', 20, 80.00, 'beard', 2),
(UUID(), 'Saç + Sakal Kombo', 'Saç kesimi ve sakal tıraşı paketi', 45, 200.00, 'package', 3),
(UUID(), 'Saç Boyama', 'Profesyonel saç boyama (kök/ tam)', 45, 180.00, 'coloring', 4),
(UUID(), 'Sakal Boyama', 'Doğal görünümde sakal boyama', 15, 60.00, 'coloring', 5),
(UUID(), 'Cilt Bakımı', 'Derin temizlik, peeling, mask ve nemlendirme', 25, 120.00, 'treatment', 6),
(UUID(), 'Kaş Düzenleme', 'Kaş şekillendirme ve tıraş', 10, 40.00, 'treatment', 7),
(UUID(), 'Çocuk Kesimi (0-12 yaş)', 'Çocuklara özel saç kesimi', 20, 100.00, 'kids', 8);

-- Admin Kullanıcısı (Şifre: Admin123! - password_hash ile hashlenmiş olmalı)
-- INSERT INTO `users` (`uuid`, `role`, `name`, `phone`, `email`, `password_hash`, `is_verified`, `is_active`) VALUES
-- (UUID(), 'admin', 'Admin User', '+905550000000', 'admin@berberali.com', '$2y$10$...', 1, 1);

SET FOREIGN_KEY_CHECKS = 1;